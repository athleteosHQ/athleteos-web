import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = 'AthleteOS <founders@athleteos.io>'

interface FounderWelcomeParams {
  to: string
  founderNumber: number
}

export async function sendFounderWelcomeEmail({ to, founderNumber }: FounderWelcomeParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `You're in: Founding Member`,
      html: buildFounderEmailHtml(founderNumber),
    })

    if (error) {
      console.error('[email] Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('[email] Failed to send:', err)
    return { success: false, error: 'Email delivery failed' }
  }
}

function buildFounderEmailHtml(founderNumber: number): string {
  const earlyBird = founderNumber <= 10
  const founderNote = earlyBird
    ? `You're early because you've felt the same thing I did: you train hard, track everything, and still don't know why performance gets stuck.`
    : `You're in because you've felt the same thing most athletes never get an answer to: you train hard, track everything, and still something refuses to move.`
  const founderContext = earlyBird
    ? `I built AthleteOS after getting tired of switching between training logs, nutrition apps, and recovery metrics that could show me numbers but not the reason my progress stalled.`
    : `AthleteOS exists to close that gap between effort and result with one clear diagnosis instead of more disconnected dashboards.`

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#09090B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:48px 24px;">

      <!-- Logo -->
      <div style="margin-bottom:40px;text-align:center;">
        <span style="font-size:20px;font-weight:800;color:#FAFAFA;letter-spacing:-0.03em;">athlete</span><span style="font-size:20px;font-weight:800;color:#a1a1aa;letter-spacing:-0.03em;">OS</span>
      </div>

      <!-- 🔥 Personal founder note — the screenshot moment -->
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;margin-bottom:32px;">
        <p style="margin:0 0 12px;font-size:13px;color:#FAFAFA;font-weight:700;">A personal note from the founder</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#a1a1aa;">
          ${founderNote}
        </p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#a1a1aa;">
          ${founderContext}
        </p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#FAFAFA;font-weight:600;">
          Not with more tracking. With one clear answer: what's limiting progress, and what to change next.
        </p>
        <p style="margin:12px 0 0;font-size:13px;color:#71717A;">As a founding member, you'll have direct access to me while we build it.</p>
        <p style="margin:12px 0 0;font-size:13px;color:#71717A;">— Swetabh, Founder</p>
      </div>

      <!-- Founder badge — hero moment -->
      <div style="background:linear-gradient(180deg,#111113,#0C0C0E);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;margin-bottom:32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#71717A;">🎖️ Founding Member</p>
        <p style="margin:0;font-size:40px;font-weight:800;color:#FAFAFA;letter-spacing:-0.03em;">First Cohort</p>
        <p style="margin:8px 0 0;font-size:13px;color:#71717A;">Early access before public launch</p>
      </div>

      <!-- What you just locked -->
      <div style="margin-bottom:32px;">
        <p style="font-size:14px;font-weight:700;color:#FAFAFA;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">🔒 What you just locked in</p>

        <div style="padding:12px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:8px;">
          <p style="margin:0;font-size:14px;color:#FAFAFA;">✅ Full diagnostic system at launch</p>
          <p style="margin:4px 0 0;font-size:12px;color:#71717A;">Training, nutrition, and recovery — read as one system</p>
        </div>

        <div style="padding:12px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:8px;">
          <p style="margin:0;font-size:14px;color:#FAFAFA;">✅ ₹250/mo founding rate — locked forever</p>
          <p style="margin:4px 0 0;font-size:12px;color:#71717A;">Regular price will be ₹599/mo. Yours stays fixed.</p>
        </div>

        <div style="padding:12px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:8px;">
          <p style="margin:0;font-size:14px;color:#FAFAFA;">✅ Direct WhatsApp line to the founder</p>
          <p style="margin:4px 0 0;font-size:12px;color:#71717A;">First 90 days. Not a support bot. Me.</p>
        </div>

        <div style="padding:12px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
          <p style="margin:0;font-size:14px;color:#FAFAFA;">✅ Your feedback shapes the system before public launch</p>
          <p style="margin:4px 0 0;font-size:12px;color:#71717A;">The first version gets built with founding-member input.</p>
        </div>
      </div>

      <!-- What happens next -->
      <div style="margin-bottom:32px;">
        <p style="font-size:14px;font-weight:700;color:#FAFAFA;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">📋 What happens next</p>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;vertical-align:top;width:80px;">
              <span style="font-size:11px;font-weight:700;color:#2DDC8F;text-transform:uppercase;letter-spacing:0.08em;">Now</span>
            </td>
            <td style="padding:8px 0;font-size:13px;color:#a1a1aa;">Your spot is reserved. No payment needed yet.</td>
          </tr>
          <tr>
            <td style="padding:8px 0;vertical-align:top;">
              <span style="font-size:11px;font-weight:700;color:#2DDC8F;text-transform:uppercase;letter-spacing:0.08em;">This week</span>
            </td>
            <td style="padding:8px 0;font-size:13px;color:#a1a1aa;">I'll reach out on WhatsApp to understand your training and where you've hit walls.</td>
          </tr>
          <tr>
            <td style="padding:8px 0;vertical-align:top;">
              <span style="font-size:11px;font-weight:700;color:#2DDC8F;text-transform:uppercase;letter-spacing:0.08em;">At launch</span>
            </td>
            <td style="padding:8px 0;font-size:13px;color:#a1a1aa;">You're first in. Full system access, founding rate active.</td>
          </tr>
        </table>
      </div>

      <!-- The thesis -->
      <div style="background:rgba(255,255,255,0.02);border-left:2px solid rgba(255,255,255,0.1);padding:16px 20px;margin-bottom:32px;border-radius:0 8px 8px 0;">
        <p style="font-size:15px;line-height:1.7;color:#FAFAFA;margin:0 0 8px;font-weight:600;">
          Most athletes already have the data. They just don't have the diagnosis.
        </p>
        <p style="font-size:13px;line-height:1.6;color:#71717A;margin:0;">
          AthleteOS reads your training, nutrition, and recovery as one system — finds the one thing limiting progress — and tells you exactly what to change. Not more numbers. One decision.
        </p>
      </div>

      <!-- Sign off -->
      <p style="font-size:16px;color:#FAFAFA;margin:0 0 32px;font-weight:700;">
        Train hard. We'll find the limiter.
      </p>

      <!-- Signature -->
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
        <p style="font-size:14px;color:#FAFAFA;margin:0 0 4px;font-weight:600;">Swetabh</p>
        <p style="font-size:13px;color:#71717A;margin:0;">Founder, AthleteOS</p>
        <p style="font-size:12px;margin:8px 0 0;">
          <a href="mailto:founder@athleteos.io" style="color:#a1a1aa;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            <span style="display:inline-flex;vertical-align:middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 5.75A1.75 1.75 0 0 1 4.75 4h14.5A1.75 1.75 0 0 1 21 5.75v12.5A1.75 1.75 0 0 1 19.25 20H4.75A1.75 1.75 0 0 1 3 18.25V5.75Zm1.5.34v.12l7.1 5.16a.75.75 0 0 0 .88 0l7.02-5.16v-.12a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25Zm15 1.97-6.14 4.5a2.25 2.25 0 0 1-2.66 0L4.5 8.04v10.21c0 .14.11.25.25.25h14.5a.25.25 0 0 0 .25-.25V8.06Z" fill="#A1A1AA"/>
              </svg>
            </span>
            <span>founder@athleteos.io</span>
          </a>
          <span style="color:#71717A;margin:0 8px;">·</span>
          <a href="https://wa.me/919880418844" style="color:#a1a1aa;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            <span style="display:inline-flex;vertical-align:middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .16 5.34.16 11.92c0 2.1.55 4.15 1.59 5.97L0 24l6.3-1.65a11.93 11.93 0 0 0 5.78 1.48h.01c6.58 0 11.92-5.34 11.92-11.92 0-3.18-1.24-6.17-3.49-8.43Zm-8.44 18.34h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.21-3.74.98 1-3.64-.23-.38a9.91 9.91 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.9a9.86 9.86 0 0 1 2.91 7.02c0 5.47-4.46 9.91-9.92 9.91Zm5.44-7.44c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.45-1.74-1.62-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.23-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.03-1.05 2.52 0 1.48 1.08 2.92 1.23 3.12.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z" fill="#A1A1AA"/>
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>
        </p>
      </div>

      <!-- Footer -->
      <div style="margin-top:40px;text-align:center;">
        <p style="font-size:11px;color:#3f3f46;margin:0;">
          You're receiving this because you reserved a founding spot at athleteos.io
        </p>
      </div>
    </div>
  </body>
</html>`.trim()
}
