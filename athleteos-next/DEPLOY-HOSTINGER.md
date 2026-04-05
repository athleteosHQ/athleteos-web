# Hostinger Deployment Guide — AthleteOS

## Build & Start Commands

In Hostinger dashboard → Web Apps → Create app → GitHub → Select repo:

| Setting | Value |
|---------|-------|
| **Root directory** | `athleteos-next` |
| **Build command** | `npm install && npm run build` |
| **Start command** | `npm run start` |
| **Node.js version** | 20.x (or latest LTS) |
| **Branch** | `exp_2` (or `main` after merge) |

## Environment Variables

Add ALL of these in Hostinger dashboard → Environment Variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_sYRGhz7pLwKF7HGT3rnNVrt6xGjSvZhK3jkTEgJYk2Zw
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Email (Resend)
RESEND_API_KEY=<your-resend-api-key>

# App
NODE_ENV=production
```

## Domain Setup

After purchase, point your domain:
1. Hostinger dashboard → Domains → Manage
2. DNS should auto-configure if domain is registered with Hostinger
3. If external domain: point A record to the IP shown in Hostinger dashboard
4. SSL auto-provisions via Let's Encrypt

## Post-Deploy Checklist

- [ ] Site loads at your domain
- [ ] Calculator works (enter lifts, get result)
- [ ] Inline signup submits (check Supabase `founders_waitlist` table)
- [ ] PostHog events appear in dashboard (open browser console, look for `[PostHog.js]`)
- [ ] Welcome email sends after signup (check Resend dashboard)
- [ ] Rate limiting works (hit /api/founders/reserve 6 times rapidly — 6th should 429)
- [ ] Honeypot works (curl with `website` field filled — should return fake success)
- [ ] HTTPS enforced (http redirects to https)
