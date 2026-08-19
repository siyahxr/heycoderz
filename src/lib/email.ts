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
 * Formats a clean, aesthetically shortened display URL
 */
function formatShortenedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.host;
    const pathname = parsed.pathname;
    const token = parsed.searchParams.get("token") || "";
    if (token.length > 18) {
      return `${host}${pathname}?token=${token.substring(0, 10)}...${token.substring(token.length - 6)}`;
    }
    return `${host}${pathname}${parsed.search}`;
  } catch {
    if (url.length > 45) {
      return url.substring(0, 32) + "..." + url.substring(url.length - 8);
    }
    return url;
  }
}

/**
 * Builds the ultra-clean, modern Light Theme HTML email template for HeyCoderz Email Verification.
 * Optimized for Gmail Web/Mobile and light background clients.
 */
export function buildVerificationEmailHtml({
  name,
  verificationUrl,
}: {
  name?: string;
  verificationUrl: string;
}): string {
  const recipientName = name ? name : "Geliştirici";
  const displayUrl = formatShortenedUrl(verificationUrl);

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
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
    }
    .btn-gradient:hover {
      background: #6d28d9 !important;
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45) !important;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 10px !important;
      }
      .main-card {
        padding: 32px 20px !important;
        border-radius: 20px !important;
      }
      .title-text {
        font-size: 22px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 12px; background-color: #f1f5f9; color: #0f172a;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    HeyCoderz hesabını aktifleştirmek için lütfen e-posta adresini doğrula.
  </div>

  <center style="width: 100%; background-color: #f1f5f9;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto;" class="email-container">
      
      <!-- Top Brand Badge -->
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background-color: #1e1b4b; border-radius: 12px; padding: 8px 18px; box-shadow: 0 4px 12px rgba(30, 27, 75, 0.15);">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 800; color: #c084fc; letter-spacing: 1px;">&lt;/&gt;</span>
                <span style="font-size: 14px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">HEYCODERZ</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main Clean White Card -->
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px 36px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);">
            
            <!-- Modern Soft Purple Icon Container -->
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 20px; width: 68px; height: 68px; text-align: center; vertical-align: middle;">
                      <div style="font-size: 30px; line-height: 1;">
                        ✉️
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom: 12px;">
                <h1 class="title-text" style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  E-postanı Doğrula
                </h1>
              </td>
            </tr>

            <!-- Greeting & Description -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1e293b;">
                  Merhaba ${recipientName},
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 22px; color: #475569; max-width: 380px;">
                  HeyCoderz topluluğuna katıldığın için heyecanlıyız! Hesabını aktifleştirmek için lütfen e-posta adresini doğrula.
                </p>
              </td>
            </tr>

            <!-- Main CTA Button -->
            <tr>
              <td align="center" style="padding-bottom: 18px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);">
                      <a href="${verificationUrl}" target="_blank" class="btn-gradient" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        E-postamı Doğrula &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Expiry Pill Badge -->
            <tr>
              <td align="center" style="padding-bottom: 22px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 20px; padding: 6px 14px;">
                      <span style="font-size: 12px; color: #6d28d9; font-weight: 600;">
                        ⏱ 15 dakika geçerlidir
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shortened Monospace Fallback URL Box -->
            <tr>
              <td style="padding-bottom: 18px;">
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; word-break: break-all; text-align: center;">
                  <a href="${verificationUrl}" target="_blank" style="color: #475569; font-size: 11px; font-family: 'Courier New', Courier, monospace; text-decoration: none; line-height: 16px; font-weight: 500;">
                    ${displayUrl}
                  </a>
                </div>
              </td>
            </tr>

            <!-- Security Notice Box -->
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px 16px;">
                  <tr>
                    <td width="28" style="vertical-align: middle; padding-right: 8px; font-size: 16px;">
                      🛡️
                    </td>
                    <td style="vertical-align: middle;">
                      <p style="margin: 0; font-size: 11px; line-height: 16px; color: #64748b;">
                        Bu talebi siz yapmadınız mı? Bu e-postayı güvenle yok sayabilirsiniz.
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
 * Builds plain text fallback for email verification
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
HeyCoderz topluluğuna katıldığın için heyecanlıyız! Hesabını aktifleştirmek için lütfen aşağıdaki doğrulama bağlantısına tıkla:

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
 * Builds the ultra-clean, modern Light Theme HTML email template for HeyCoderz Password Reset.
 */
export function buildPasswordResetEmailHtml({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): string {
  const recipientName = name ? name : "Geliştirici";
  const displayUrl = formatShortenedUrl(resetUrl);

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
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
    }
    .btn-gradient:hover {
      background: #6d28d9 !important;
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45) !important;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 10px !important;
      }
      .main-card {
        padding: 32px 20px !important;
        border-radius: 20px !important;
      }
      .title-text {
        font-size: 22px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 12px; background-color: #f1f5f9; color: #0f172a;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    HeyCoderz hesabın için şifre sıfırlama bağlantısı.
  </div>

  <center style="width: 100%; background-color: #f1f5f9;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto;" class="email-container">
      
      <!-- Top Brand Badge -->
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background-color: #1e1b4b; border-radius: 12px; padding: 8px 18px; box-shadow: 0 4px 12px rgba(30, 27, 75, 0.15);">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 800; color: #c084fc; letter-spacing: 1px;">&lt;/&gt;</span>
                <span style="font-size: 14px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">HEYCODERZ</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main Clean White Card -->
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px 36px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);">
            
            <!-- Modern Soft Purple Icon Container -->
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 20px; width: 68px; height: 68px; text-align: center; vertical-align: middle;">
                      <div style="font-size: 30px; line-height: 1;">
                        🔑
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom: 12px;">
                <h1 class="title-text" style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  Şifreni Sıfırla
                </h1>
              </td>
            </tr>

            <!-- Greeting & Description -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1e293b;">
                  Merhaba ${recipientName},
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 22px; color: #475569; max-width: 380px;">
                  HeyCoderz hesabın için bir şifre sıfırlama talebinde bulunuldu. Yeni şifreni güvenli bir şekilde belirlemek için aşağıdaki butona tıkla.
                </p>
              </td>
            </tr>

            <!-- Main CTA Button -->
            <tr>
              <td align="center" style="padding-bottom: 18px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);">
                      <a href="${resetUrl}" target="_blank" class="btn-gradient" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Şifremi Sıfırla &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Expiry Pill Badge -->
            <tr>
              <td align="center" style="padding-bottom: 22px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 20px; padding: 6px 14px;">
                      <span style="font-size: 12px; color: #6d28d9; font-weight: 600;">
                        ⏱ 15 dakika geçerlidir
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shortened Monospace Fallback URL Box -->
            <tr>
              <td style="padding-bottom: 18px;">
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; word-break: break-all; text-align: center;">
                  <a href="${resetUrl}" target="_blank" style="color: #475569; font-size: 11px; font-family: 'Courier New', Courier, monospace; text-decoration: none; line-height: 16px; font-weight: 500;">
                    ${displayUrl}
                  </a>
                </div>
              </td>
            </tr>

            <!-- Security Notice Box -->
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px 16px;">
                  <tr>
                    <td width="28" style="vertical-align: middle; padding-right: 8px; font-size: 16px;">
                      🛡️
                    </td>
                    <td style="vertical-align: middle;">
                      <p style="margin: 0; font-size: 11px; line-height: 16px; color: #64748b;">
                        Bu talebi siz yapmadınız mı? Bu e-postayı güvenle yok sayabilir veya şifrenizi sıfırlayabilirsiniz.
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
 * Builds plain text fallback for password reset
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
