import nodemailer from 'nodemailer';

function getGmailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  
  if (!user || !pass) {
    console.error('[EMAIL] GMAIL_USER or GMAIL_APP_PASSWORD not configured');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });
}

export async function sendPasswordResetEmail(toEmail: string, resetLink: string): Promise<boolean> {
  try {
    const transporter = getGmailTransporter();
    
    if (!transporter) {
      console.log('[EMAIL] Gmail SMTP not configured, skipping email');
      return false;
    }
    
    const mailOptions = {
      from: `"SeaPark.id" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset Password - SeaPark.id',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">SeaPark.id</h1>
              <p style="color: #cffafe; margin: 8px 0 0 0; font-size: 14px;">Konservasi Laut Indonesia</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px;">Reset Password</h2>
              <p style="color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
                Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
              </p>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  Atau salin link berikut ke browser Anda:<br>
                  <a href="${resetLink}" style="color: #0891b2; word-break: break-all;">${resetLink}</a>
                </p>
              </div>
            </div>
            <div style="background-color: #f8fafc; padding: 20px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                SeaPark.id - Platform Wisata Konservasi Laut Indonesia
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error);
    return false;
  }
}

export async function sendTicketConfirmationEmail(toEmail: string, ticketDetails: {
  ticketId: string;
  locationName: string;
  visitDate: string;
  visitors: number;
  totalPrice: number;
}): Promise<boolean> {
  try {
    const transporter = getGmailTransporter();
    
    if (!transporter) {
      console.log('[EMAIL] Gmail SMTP not configured, skipping email');
      return false;
    }
    
    const mailOptions = {
      from: `"SeaPark.id" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Konfirmasi Tiket - ${ticketDetails.locationName} | SeaPark.id`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">SeaPark.id</h1>
              <p style="color: #cffafe; margin: 8px 0 0 0; font-size: 14px;">Tiket Anda Terkonfirmasi!</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px;">Detail Tiket</h2>
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0;"><strong>ID Tiket:</strong> ${ticketDetails.ticketId}</p>
                <p style="margin: 0 0 12px 0;"><strong>Lokasi:</strong> ${ticketDetails.locationName}</p>
                <p style="margin: 0 0 12px 0;"><strong>Tanggal Kunjungan:</strong> ${ticketDetails.visitDate}</p>
                <p style="margin: 0 0 12px 0;"><strong>Jumlah Pengunjung:</strong> ${ticketDetails.visitors} orang</p>
                <p style="margin: 0;"><strong>Total:</strong> Rp ${ticketDetails.totalPrice.toLocaleString('id-ID')}</p>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                Tunjukkan QR code di aplikasi saat berkunjung. Selamat menikmati keindahan laut Indonesia!
              </p>
            </div>
            <div style="background-color: #f8fafc; padding: 20px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                SeaPark.id - Platform Wisata Konservasi Laut Indonesia
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] Ticket confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send ticket confirmation email:', error);
    return false;
  }
}

export async function verifySmtpConnection(): Promise<boolean> {
  const transporter = getGmailTransporter();
  if (!transporter) return false;
  
  try {
    await transporter.verify();
    console.log('[EMAIL] Gmail SMTP connection verified');
    return true;
  } catch (error) {
    console.error('[EMAIL] Gmail SMTP verification failed:', error);
    return false;
  }
}
