import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Waves, Loader2, Mail, Lock, User, ArrowLeft, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login, register, loginPending, registerPending } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "login") {
        await login({ email, password });
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali",
        });
        setLocation("/");
      } else if (mode === "register") {
        await register({ email, password, firstName, lastName });
        toast({
          title: "Registrasi berhasil!",
          description: "Akun kamu sudah dibuat",
        });
        setLocation("/");
      }
    } catch (error: any) {
      toast({
        title: mode === "login" ? "Login gagal" : "Registrasi gagal",
        description: error.message || "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email diperlukan",
        description: "Masukkan email kamu untuk reset password",
        variant: "destructive",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/forgot-password", { email });
      const data = await res.json();
      
      if (data.resetLink) {
        setResetLink(data.resetLink);
        setForgotSuccess(true);
        toast({
          title: data.emailSent ? "Link Reset Dikirim" : "Link Reset Tersedia",
          description: data.emailSent 
            ? "Cek email kamu untuk link reset password. Link berlaku selama 1 jam."
            : "Gunakan link di bawah untuk reset password.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Gagal mengirim reset link",
        description: error.message || "Email tidak ditemukan atau terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 pt-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {mode === "forgot" ? (
              <KeyRound className="w-8 h-8 text-primary" />
            ) : (
              <Waves className="w-8 h-8 text-primary" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-display">
              {mode === "login" ? "Masuk" : mode === "register" ? "Daftar" : "Lupa Password"}
            </CardTitle>
            <CardDescription className="mt-2">
              {mode === "login" 
                ? "Masuk ke akun seapark.id kamu" 
                : mode === "register"
                ? "Buat akun baru untuk menjelajahi laut Indonesia"
                : "Masukkan email untuk reset password"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {mode === "forgot" ? (
            forgotSuccess ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Link Reset Tersedia</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Klik tombol di bawah untuk reset password akun <strong>{email}</strong>. 
                    Link berlaku selama 1 jam.
                  </p>
                </div>
                {resetLink && (
                  <Button
                    className="w-full"
                    onClick={() => window.location.href = resetLink}
                    data-testid="button-go-reset"
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Reset Password Sekarang
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMode("login");
                    setForgotSuccess(false);
                    setResetLink("");
                  }}
                  data-testid="button-back-to-login"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-forgot-email"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kami akan mengirim link untuk reset password ke email ini
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotLoading}
                  data-testid="button-send-reset"
                >
                  {forgotLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Kirim Link Reset
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode("login")}
                  data-testid="button-back-login"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Login
                </Button>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Nama depan"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          data-testid="input-firstName"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input
                        id="lastName"
                        placeholder="Nama belakang"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-0 h-auto text-xs text-primary"
                        onClick={() => setMode("forgot")}
                        data-testid="button-forgot-password"
                      >
                        Lupa password?
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                      data-testid="input-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginPending || registerPending}
                  data-testid="button-submit"
                >
                  {(loginPending || registerPending) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {mode === "login" ? "Masuk" : "Daftar"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
                  <Button
                    variant="ghost"
                    className="px-2 text-primary underline-offset-4 hover:underline"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    data-testid="button-toggle-mode"
                  >
                    {mode === "login" ? "Daftar" : "Masuk"}
                  </Button>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
