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
      subject: `You're Founding Member #${founderNumber} — AthleteOS`,
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
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body
    style="margin:0;padding:0;background:#0C0C0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"
  >
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <!-- Logo -->
      <div style="margin-bottom:32px;">
        <span style="font-size:18px;font-weight:800;color:#EDEDEF;letter-spacing:-0.03em;">athlete</span
        ><span style="font-size:18px;font-weight:800;color:#6B7AED;letter-spacing:-0.03em;">OS</span>
      </div>

      <!-- Founder badge -->
      <div
        style="background:#131315;border:1px solid rgba(107,122,237,0.18);border-radius:12px;padding:24px;margin-bottom:28px;"
      >
        <p
          style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#6B7AED;"
        >
          Founding Member
        </p>
        <p style="margin:0;font-size:36px;font-weight:800;color:#EDEDEF;">#${founderNumber}</p>
      </div>

      <!-- Letter -->
      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        You just became a founding member. Not because you clicked a button but because you're the kind of athlete who
        wants to understand, not just track.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        Most athletes have the data. Training logs. Macro counts. Sleep scores. Spread across three apps that never talk
        to each other. The data exists. The insight doesn't.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        AthleteOS takes what you already track training load, nutrition timing, recovery patterns and reads them
        together as one system. Not more numbers. One read that surfaces a pattern you've been sitting on for months,
        because no single app had enough context to flag it.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#EDEDEF;margin:0 0 16px;">
        Intelligence compounds. That's the thesis.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        The first read needs a week of your data. The second is sharper because it has context from the first. By the
        fourth cycle, the system knows your patterns better than you do it doesn't forget, doesn't get biased by how a
        session felt, doesn't confuse correlation with cause.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        You're here before the system is live. That's intentional on both sides. Your data, your feedback, your pushback
        they shape what gets built. The first fifty members aren't beta testers. You're the calibration set.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        Before launch, I'll reach out directly. Not to sell you anything to understand how you think about your
        training, where you've hit walls, and what a useful read would actually look like for your situation.
      </p>

      <p style="font-size:15px;line-height:1.7;color:#9CA3AF;margin:0 0 16px;">
        Your rate is locked. Your spot is reserved. When the system goes live, you're first in.
      </p>

      <p style="font-size:16px;line-height:1.7;color:#EDEDEF;margin:0 0 32px;font-weight:600;">
        Train hard. We'll handle the rest.
      </p>

      <!-- Signature -->
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;margin-top:32px;">
        <p style="font-size:14px;color:#EDEDEF;margin:0 0 4px;font-weight:600;">Swetabh</p>
        <p style="font-size:13px;color:#6B7280;margin:0;">Founder, AthleteOS</p>
        <p style="font-size:12px;color:#6B7280;margin:8px 0 0;">
          <a href="mailto:founder@athleteos.io" style="color:#6B7AED;text-decoration:none;">founder@athleteos.io</a>
        </p>
      </div>
    </div>
  </body>
</html>`.trim()
}
