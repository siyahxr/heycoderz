import { Resend } from "resend";

export interface SendVerificationEmailParams {
  email: string;
  name?: string;
  username?: string;
  token: string;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Generates the App Base URL for verification links.
 * Checks NEXT_PUBLIC_APP_URL, APP_URL, VERCEL_URL, or defaults to https://heycoderz.com
 */
export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://heycoderz.com";
}

/**
 * Builds the professional responsive HTML email template for HeyCoderz.
 * Colors:
 * - background: #050508
 * - card: #0c0a14
 * - border: #2e1065 / #221a36
 * - text: #ffffff
 * - accent: #8b5cf6 / #a855f7
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
  <title>E-postanı doğrula - HeyCoderz</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #030306;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
    }
    .btn-hover:hover {
      background: #7c3aed !important;
      box-shadow: 0 0 35px rgba(139, 92, 246, 0.7) !important;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        padding-left: 14px !important;
        padding-right: 14px !important;
      }
      .main-card {
        padding: 32px 18px !important;
        border-radius: 20px !important;
      }
      .h1-title {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 36px 0; background-color: #030306; color: #ffffff;">
  <!-- Preheader text (Invisible in body, visible in inbox preview) -->
  <div style="display: none; font-size: 1px; color: #030306; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    HeyCoderz'e hoş geldin! 🎉 Hesabını aktifleştirmek için e-posta adresini doğrulaman gerekiyor.
  </div>

  <center style="width: 100%; background-color: #030306;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto;" class="email-container">
      
      <!-- Top Welcome Note & Logo -->
      <tr>
        <td align="center" style="padding-bottom: 24px;">
          <p style="margin: 0 0 16px 0; font-size: 13px; color: #a1a1aa; font-weight: 500;">
            HeyCoderz&apos;e hoş geldin! 🎉
          </p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background-color: #180d2b; border: 1px solid #7c3aed; border-radius: 10px; width: 36px; height: 36px; text-align: center; vertical-align: middle;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 16px; font-weight: 800; color: #c084fc; line-height: 36px; display: inline-block;">&lt;/&gt;</span>
              </td>
              <td style="padding-left: 10px; vertical-align: middle;">
                <span style="font-size: 20px; font-weight: 900; letter-spacing: 0.8px; color: #ffffff; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">HEY<span style="color: #a855f7;">CODERZ</span></span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main Card -->
      <tr>
        <td>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card" style="background-color: #0c0a14; border: 1px solid #2e1065; border-radius: 24px; padding: 40px 36px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(124, 58, 237, 0.15);">
            
            <!-- Envelope Illustration / Header Graphic -->
            <tr>
              <td align="center" style="padding-bottom: 28px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background: linear-gradient(145deg, #1f143d 0%, #100a24 100%); border: 1px solid #6d28d9; border-radius: 20px; width: 96px; height: 76px; text-align: center; vertical-align: middle; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.35);">
                      <div style="font-size: 34px; line-height: 1; filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.6));">
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
                <h1 class="h1-title" style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                  E-postanı <span style="color: #a855f7;">doğrula</span>
                </h1>
              </td>
            </tr>

            <!-- Greeting & Description -->
            <tr>
              <td align="center" style="padding-bottom: 28px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #e4e4e7;">
                  Merhaba <span style="color: #c084fc;">${recipientName}</span>,
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 22px; color: #a1a1aa; max-width: 440px;">
                  HeyCoderz topluluğuna hoş geldin! Hesabını aktifleştirmek için e-posta adresini doğrulaman gerekiyor.
                </p>
              </td>
            </tr>

            <!-- Main Button -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius: 14px; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); box-shadow: 0 0 25px rgba(124, 58, 237, 0.45);">
                      <a href="${verificationUrl}" target="_blank" class="btn-hover" style="display: inline-block; padding: 15px 38px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 14px; border: 1px solid rgba(255,255,255,0.18); letter-spacing: 0.3px;">
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
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: #120e24; border: 1px solid #2a1c4a; border-radius: 12px; padding: 12px 18px;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 8px; font-size: 15px;">
                      ⏱️
                    </td>
                    <td style="vertical-align: middle;">
                      <span style="font-size: 12px; color: #a1a1aa; line-height: 18px;">
                        Bu doğrulama bağlantısı <strong style="color: #c084fc; font-weight: 700;">15 dakika</strong> içinde geçerliliğini yitirecektir.
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider with 'veya' -->
            <tr>
              <td style="padding: 6px 0 20px 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="border-bottom: 1px solid #1f1a33; width: 44%;"></td>
                    <td align="center" style="width: 12%; font-size: 12px; color: #71717a; font-weight: 500; text-transform: lowercase;">
                      veya
                    </td>
                    <td style="border-bottom: 1px solid #1f1a33; width: 44%;"></td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Fallback URL -->
            <tr>
              <td style="padding-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 500; color: #a1a1aa;">
                  Buton çalışmıyorsa bağlantıyı tarayıcına yapıştır:
                </p>
                <div style="background-color: #06050b; border: 1px solid #1f1a33; border-radius: 10px; padding: 12px 14px; word-break: break-all;">
                  <a href="${verificationUrl}" style="color: #a78bfa; font-size: 11px; font-family: 'Courier New', Courier, monospace; text-decoration: none; line-height: 16px;">
                    ${verificationUrl}
                  </a>
                </div>
              </td>
            </tr>

            <!-- Security Notice Box -->
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #120e24; border: 1px solid #2a1c4a; border-radius: 16px; padding: 16px 18px;">
                  <tr>
                    <td width="42" style="vertical-align: top; padding-right: 12px;">
                      <div style="background-color: rgba(139, 92, 246, 0.18); border: 1px solid rgba(139, 92, 246, 0.35); border-radius: 10px; width: 36px; height: 36px; text-align: center; line-height: 36px; font-size: 16px;">
                        🛡️
                      </div>
                    </td>
                    <td style="vertical-align: middle;">
                      <p style="margin: 0 0 3px 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                        Bu e-postayı sen istemedin mi?
                      </p>
                      <p style="margin: 0; font-size: 12px; line-height: 17px; color: #9ca3af;">
                        HeyCoderz&apos;de bir hesap oluşturmadıysan bu e-postayı güvenle yok sayabilirsin.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding-top: 28px; padding-bottom: 16px;">
          <!-- Small Brand Logo -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
            <tr>
              <td align="center" style="background-color: #150c26; border: 1px solid #5b21b6; border-radius: 6px; width: 22px; height: 22px; text-align: center; vertical-align: middle;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #c084fc; line-height: 22px;">&lt;/&gt;</span>
              </td>
              <td style="padding-left: 8px; vertical-align: middle;">
                <span style="font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">HEY<span style="color: #a855f7;">CODERZ</span></span>
              </td>
            </tr>
          </table>

          <p style="margin: 0 0 16px 0; font-size: 12px; color: #71717a;">
            Geliştirici ekosistemi &amp; modern yazılım platformu
          </p>

          <!-- Social links / handles -->
          <p style="margin: 0 0 16px 0; font-size: 12px; color: #9ca3af;">
            <a href="https://github.com/heycoderz" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">GitHub</a> &bull;
            <a href="https://twitter.com/heycoderz" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Twitter (X)</a> &bull;
            <a href="https://discord.gg/heycoderz" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Discord</a> &bull;
            <a href="https://instagram.com/heycoderz" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Instagram</a>
          </p>

          <p style="margin: 0; font-size: 11px; color: #52525b;">
            &copy; 2026 HeyCoderz. Tüm hakları saklıdır.
          </p>
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
HeyCoderz topluluğuna hoş geldin! Hesabını aktifleştirmek için e-posta adresini doğrulaman gerekiyor.

Doğrulama bağlantısı:
${verificationUrl}

Bu bağlantı 15 dakika içinde geçerliliğini yitirecektir.

Bu e-postayı sen istemediysen veya HeyCoderz'de bir hesap oluşturmadıysan güvenle yok sayabilirsin.

© 2026 HeyCoderz. Tüm hakları saklıdır.
Geliştirici ekosistemi & modern yazılım platformu`;
}

/**
 * Sends the verification email via Resend API.
 * Uses environment variable RESEND_API_KEY and RESEND_FROM_EMAIL.
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

  // Handle local development simulation when RESEND_API_KEY is not configured
  if (!apiKey || apiKey === "" || apiKey.includes("123456789")) {
    console.log("\n=======================================================");
    console.log("📨 [HEYCODERZ EMAIL SERVICE - DEV SIMULATION]");
    console.log(`To: ${email} (${name || username || "User"})`);
    console.log(`From: ${fromEmail}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log("Notice: Set a valid RESEND_API_KEY in .env.local for real sending.");
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
      console.error("Resend API Error details:", error);
      return {
        success: false,
        error: error.message || "E-posta gönderiminde bir hata oluştu.",
      };
    }

    console.log(`✅ Verification email sent successfully via Resend to ${email} (ID: ${data?.id})`);
    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    console.error("Critical error while sending email via Resend:", err);
    return {
      success: false,
      error: err.message || "Sunucu e-posta servisine erişirken hata oluştu.",
    };
  }
}
