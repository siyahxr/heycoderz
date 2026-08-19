import { Resend } from "resend";

export interface SendVerificationEmailParams {
  email: string;
  name?: string;
  username: string;
  token: string;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Returns the base application URL.
 */
function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const raw = process.env.NEXT_PUBLIC_APP_URL.trim();
    return raw.endsWith("/") ? raw.slice(0, -1) : raw;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://heycoderz.com";
}

/**
 * Builds the ultra-modern HTML email template for HeyCoderz Email Verification.
 * Optimized for Gmail Web/Mobile and dark mode rendering.
 */
export function buildVerificationEmailHtml({
  name,
  verificationUrl,
}: {
  name?: string;
  verificationUrl: string;
}): string {
  const recipientName = name ? name : "Geliştirici";

  return `<!DOCTYPE html>
<html lang="tr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>E-postanı Doğrula - HeyCoderz</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #06050c;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
    }
    .btn-glow:hover {
      background: #9333ea !important;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.7) !important;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 12px !important;
      }
      .main-card {
        padding: 30px 18px !important;
        border-radius: 20px !important;
      }
      .title-text {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #06050c; color: #ffffff;">
  <!-- Preheader preview text -->
  <div style="display: none; font-size: 1px; color: #06050c; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    HeyCoderz hesabını aktifleştirmek için e-posta adresini doğrula.
  </div>

  <center style="width: 100%; background-color: #06050c;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto;" class="email-container">
      
      <!-- Top Brand Header -->
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #1c1335 0%, #100b20 100%); border: 1px solid #7c3aed; border-radius: 12px; padding: 6px 16px; box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight: 800; color: #c084fc; letter-spacing: 1px;">&lt;/&gt;</span>
                <span style="font-size: 15px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">HEYCODERZ</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main Card -->
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card" style="background-color: #0d0b18; border: 1px solid #6d28d9; border-radius: 24px; padding: 40px 32px; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.2);">
            
            <!-- Neon Glowing Envelope Graphic -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background: linear-gradient(145deg, #241647 0%, #120b24 100%); border: 1.5px solid #a855f7; border-radius: 22px; width: 90px; height: 72px; text-align: center; vertical-align: middle; box-shadow: 0 0 30px rgba(168, 85, 247, 0.45);">
                      <div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 0 10px rgba(192, 132, 252, 0.8));">
                        ✉️
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom: 8px;">
                <h1 class="title-text" style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  E-postanı Doğrula
                </h1>
              </td>
            </tr>

            <!-- Greeting & Description -->
            <tr>
              <td align="center" style="padding-bottom: 26px;">
                <p style="margin: 12px 0 8px 0; font-size: 15px; font-weight: 700; color: #ffffff;">
                  Merhaba ${recipientName},
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 21px; color: #94a3b8; max-width: 430px;">
                  HEY CODERZ topluluğuna katıldığın için heyecanlıyız! Hesabını güvence altına almak ve platformun tüm özelliklerine erişmek için lütfen e-posta adresini doğrula.
                </p>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td align="center" style="padding-bottom: 18px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); box-shadow: 0 4px 20px rgba(168, 85, 247, 0.45);">
                      <a href="${verificationUrl}" target="_blank" class="btn-glow" style="display: inline-block; padding: 14px 34px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); letter-spacing: 0.3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        E-postamı Doğrula &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 15-Minute Expiry Badge -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #151126; border: 1px solid #2e214d; border-radius: 20px; padding: 6px 14px;">
                      <span style="font-size: 11px; color: #cbd5e1; font-weight: 500;">
                        ⏱ 15 dakika geçerlidir
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Fallback URL Box -->
            <tr>
              <td style="padding-bottom: 20px;">
                <div style="background-color: #07060f; border: 1px solid #271e3d; border-radius: 10px; padding: 10px 12px; word-break: break-all; text-align: center;">
                  <a href="${verificationUrl}" style="color: #a78bfa; font-size: 11px; font-family: 'Courier New', Courier, monospace; text-decoration: none; line-height: 16px;">
                    ${verificationUrl}
                  </a>
                </div>
              </td>
            </tr>

            <!-- Security Notice Box -->
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #151126; border: 1px solid #2e214d; border-radius: 14px; padding: 14px 16px;">
                  <tr>
                    <td width="32" style="vertical-align: middle; padding-right: 10px; font-size: 18px;">
                      🛡️
                    </td>
                    <td style="vertical-align: middle;">
                      <p style="margin: 0; font-size: 11px; line-height: 16px; color: #94a3b8;">
                        <strong style="color: #ffffff; font-weight: 700;">Bu talebi siz yapmadınız mı?</strong> Hesabınızın güvenliği için bu e-postayı görmezden gelebilirsiniz.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}

/**
 * Builds the plain text fallback version of the verification email
 */
export function buildVerificationEmailText({
  name,
  verificationUrl,
}: {
  name?: string;
  verificationUrl: string;
}): string {
  const greeting = name ? `Merhaba ${name},` : "Merhaba,";

  return `HEY CODERZ

E-postanı Doğrula

${greeting}
HEY CODERZ topluluğuna katıldığın için heyecanlıyız! Hesabını aktifleştirmek için lütfen aşağıdaki doğrulama bağlantısına tıkla:

${verificationUrl}

⏱ Bu doğrulama bağlantısı 15 dakika içinde geçerliliğini yitirecektir.
Bu talebi siz yapmadıysanız bu e-postayı güvenle yok sayabilirsiniz.`;
}

/**
 * Sends the verification email via Resend API.
 */
export async function sendVerificationEmail({
  email,
  name,
  username,
  token,
}: SendVerificationEmailParams): Promise<EmailSendResult> {
  const baseUrl = getAppBaseUrl();
  const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "HeyCoderz <verification@heycoderz.com>";

  if (!apiKey || apiKey === "" || apiKey.includes("123456789") || apiKey.includes("your_")) {
    console.log("\n=======================================================");
    console.log("📨 [HEYCODERZ EMAIL SERVICE - DEV SIMULATION]");
    console.log(`To: ${email} (${name || username || "User"})`);
    console.log(`From: ${fromEmail}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log("=======================================================\n");

    return {
      success: true,
      id: "simulated-" + Date.now(),
      simulated: true,
    };
  }

  try {
    const resend = new Resend(apiKey);

    const htmlContent = buildVerificationEmailHtml({
      name: name || username,
      verificationUrl,
    });

    const textContent = buildVerificationEmailText({
      name: name || username,
      verificationUrl,
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "E-postanı doğrula - HeyCoderz",
      html: htmlContent,
      text: textContent,
      headers: {
        "X-Entity-Ref-ID": `verify-${Date.now()}`,
      },
    });

    if (error) {
      console.error("[EMAIL] Resend API Error:", error);
      return {
        success: false,
        error: error.message || "E-posta gönderiminde bir hata oluştu.",
      };
    }

    console.log(`[EMAIL] Verification email sent to ${email} (ID: ${data?.id})`);
    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    console.error("[EMAIL] Critical error sending verification email:", err);
    return {
      success: false,
      error: err.message || "Sunucu e-posta servisine erişirken hata oluştu.",
    };
  }
}

/**
 * Builds the ultra-modern HTML email template for HeyCoderz Password Reset.
 */
export function buildPasswordResetEmailHtml({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): string {
  const recipientName = name ? name : "Geliştirici";

  return `<!DOCTYPE html>
<html lang="tr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Şifreni Sıfırla - HeyCoderz</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #06050c;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
    }
    .btn-glow:hover {
      background: #9333ea !important;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.7) !important;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 12px !important;
      }
      .main-card {
        padding: 30px 18px !important;
        border-radius: 20px !important;
      }
      .title-text {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #06050c; color: #ffffff;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #06050c; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    HeyCoderz hesabın için şifre sıfırlama bağlantısı.
  </div>

  <center style="width: 100%; background-color: #06050c;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto;" class="email-container">
      
      <!-- Top Brand Header -->
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #1c1335 0%, #100b20 100%); border: 1px solid #7c3aed; border-radius: 12px; padding: 6px 16px; box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight: 800; color: #c084fc; letter-spacing: 1px;">&lt;/&gt;</span>
                <span style="font-size: 15px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">HEYCODERZ</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main Card -->
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card" style="background-color: #0d0b18; border: 1px solid #6d28d9; border-radius: 24px; padding: 40px 32px; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.2);">
            
            <!-- Key / Security Graphic -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background: linear-gradient(145deg, #241647 0%, #120b24 100%); border: 1.5px solid #a855f7; border-radius: 22px; width: 90px; height: 72px; text-align: center; vertical-align: middle; box-shadow: 0 0 30px rgba(168, 85, 247, 0.45);">
                      <div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 0 10px rgba(192, 132, 252, 0.8));">
                        🔑
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom: 8px;">
                <h1 class="title-text" style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  Şifreni Sıfırla
                </h1>
              </td>
            </tr>

            <!-- Greeting & Description -->
            <tr>
              <td align="center" style="padding-bottom: 26px;">
                <p style="margin: 12px 0 8px 0; font-size: 15px; font-weight: 700; color: #ffffff;">
                  Merhaba ${recipientName},
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 21px; color: #94a3b8; max-width: 430px;">
                  HeyCoderz hesabın için bir şifre sıfırlama talebinde bulunuldu. Yeni şifreni güvenli bir şekilde belirlemek için aşağıdaki butona tıkla.
                </p>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td align="center" style="padding-bottom: 18px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); box-shadow: 0 4px 20px rgba(168, 85, 247, 0.45);">
                      <a href="${resetUrl}" target="_blank" class="btn-glow" style="display: inline-block; padding: 14px 34px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); letter-spacing: 0.3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Şifremi Sıfırla &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 15-Minute Expiry Badge -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #151126; border: 1px solid #2e214d; border-radius: 20px; padding: 6px 14px;">
                      <span style="font-size: 11px; color: #cbd5e1; font-weight: 500;">
                        ⏱ 15 dakika geçerlidir
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Fallback URL Box -->
            <tr>
              <td style="padding-bottom: 20px;">
                <div style="background-color: #07060f; border: 1px solid #271e3d; border-radius: 10px; padding: 10px 12px; word-break: break-all; text-align: center;">
                  <a href="${resetUrl}" style="color: #a78bfa; font-size: 11px; font-family: 'Courier New', Courier, monospace; text-decoration: none; line-height: 16px;">
                    ${resetUrl}
                  </a>
                </div>
              </td>
            </tr>

            <!-- Security Notice Box -->
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #151126; border: 1px solid #2e214d; border-radius: 14px; padding: 14px 16px;">
                  <tr>
                    <td width="32" style="vertical-align: middle; padding-right: 10px; font-size: 18px;">
                      🛡️
                    </td>
                    <td style="vertical-align: middle;">
                      <p style="margin: 0; font-size: 11px; line-height: 16px; color: #94a3b8;">
                        <strong style="color: #ffffff; font-weight: 700;">Bu talebi siz yapmadınız mı?</strong> Hesabınızın güvenliği için bu e-postayı görmezden gelebilir veya şifrenizi sıfırlayabilirsiniz.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}

/**
 * Builds the plain text fallback version of the password reset email
 */
export function buildPasswordResetEmailText({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): string {
  const greeting = name ? `Merhaba ${name},` : "Merhaba,";

  return `HEY CODERZ

Şifreni Sıfırla

${greeting}
HeyCoderz hesabın için bir şifre sıfırlama talebinde bulunuldu. Yeni şifreni belirlemek için aşağıdaki bağlantıya tıkla:

${resetUrl}

⏱ Bu bağlantı 15 dakika içinde geçerliliğini yitirecektir.
Bu talebi siz yapmadıysanız bu e-postayı güvenle yok sayabilirsiniz.`;
}

/**
 * Sends the password reset email via Resend API.
 */
export async function sendPasswordResetEmail({
  email,
  name,
  username,
  token,
}: SendVerificationEmailParams): Promise<EmailSendResult> {
  const baseUrl = getAppBaseUrl();
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "HeyCoderz <verification@heycoderz.com>";

  if (!apiKey || apiKey === "" || apiKey.includes("123456789") || apiKey.includes("your_")) {
    console.log("\n=======================================================");
    console.log("📨 [HEYCODERZ PASSWORD RESET EMAIL - DEV SIMULATION]");
    console.log(`To: ${email} (${name || username || "User"})`);
    console.log(`From: ${fromEmail}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("=======================================================\n");

    return {
      success: true,
      id: "simulated-reset-" + Date.now(),
      simulated: true,
    };
  }

  try {
    const resend = new Resend(apiKey);

    const htmlContent = buildPasswordResetEmailHtml({
      name: name || username,
      resetUrl,
    });

    const textContent = buildPasswordResetEmailText({
      name: name || username,
      resetUrl,
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Reset your HeyCoderz password",
      html: htmlContent,
      text: textContent,
      headers: {
        "X-Entity-Ref-ID": `pwd-reset-${Date.now()}`,
      },
    });

    if (error) {
      console.error("[EMAIL] Resend API Password Reset Error:", error);
      return {
        success: false,
        error: error.message || "E-posta gönderiminde bir hata oluştu.",
      };
    }

    console.log(`[EMAIL] Password reset email sent to ${email} (ID: ${data?.id})`);
    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    console.error("[EMAIL] Critical error sending password reset email:", err);
    return {
      success: false,
      error: err.message || "Sunucu e-posta servisine erişirken hata oluştu.",
    };
  }
}
