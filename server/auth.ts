import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { storage } from "./storage";
import { sendPasswordResetEmail, verifySmtpConnection } from "./email";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token diperlukan"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  const isProd = process.env.NODE_ENV === "production";
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Email tidak ditemukan" });
          }

          if (!user.password) {
            return done(null, false, { message: "Akun tidak memiliki password" });
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Password salah" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0]?.message || "Data tidak valid";
        return res.status(400).json({ message: firstError });
      }

      const { email, password, firstName, lastName } = result.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login gagal setelah registrasi" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat registrasi" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Data tidak valid";
      return res.status(400).json({ message: firstError });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Terjadi kesalahan" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login gagal" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login gagal" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout gagal" });
      }
      res.json({ message: "Logout berhasil" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      const user = req.user as any;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: "Tidak terautentikasi" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const result = forgotPasswordSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0]?.message || "Data tidak valid";
        return res.status(400).json({ message: firstError });
      }

      const { email } = result.data;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "Email tidak ditemukan" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      await storage.setResetToken(user.id, resetToken, resetTokenExpiry);

      const baseUrl = process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
        : `http://localhost:5000`;
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

      console.log(`[RESET PASSWORD] Link untuk ${email}: ${resetLink}`);

      const emailSent = await sendPasswordResetEmail(email, resetLink);
      
      res.json({ 
        message: emailSent 
          ? "Link reset password telah dikirim ke email Anda" 
          : "Email gagal terkirim, gunakan link di bawah",
        resetLink: resetLink,
        emailSent: emailSent
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Terjadi kesalahan" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const result = resetPasswordSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0]?.message || "Data tidak valid";
        return res.status(400).json({ message: firstError });
      }

      const { token, password } = result.data;
      const user = await storage.getUserByResetToken(token);

      if (!user) {
        return res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa" });
      }

      if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ message: "Token sudah kadaluarsa" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.clearResetToken(user.id);

      res.json({ message: "Password berhasil diubah" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Terjadi kesalahan" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
