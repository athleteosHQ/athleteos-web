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
          <a href="mailto:founder@athleteos.io" style="color:#a1a1aa;text-decoration:none;">founder@athleteos.io</a>
          <span style="color:#71717A;margin:0 8px;">·</span>
          <a href="https://wa.me/916005109043" style="color:#a1a1aa;text-decoration:none;">WhatsApp</a>
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
