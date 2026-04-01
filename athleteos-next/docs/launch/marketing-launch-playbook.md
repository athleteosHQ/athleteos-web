# AthleteOS Marketing Launch Playbook

**Launch Date:** 2026-04-01
**Goal:** First 50 founding members in 72 hours
**Primary Channel:** WhatsApp + Reddit
**Secondary:** Instagram Stories + X (Twitter)

---

## Hour 0: Pre-Launch (before you go live)

### Prep your ammo
- [ ] Screenshot the sample outcome block (the full rank → limiter → correction → gain chain)
- [ ] Screenshot your own rank result (use the calculator, get a real result)
- [ ] Download your performance card from /welcome (Share as Story)
- [ ] Write 3 versions of your personal launch message (see templates below)
- [ ] Create a short screen recording: land on page → scroll → enter lifts → see result (30 sec max)

### Seed your referral loop
- [ ] Sign up as Founding Member #1 yourself
- [ ] Get your invite link from /welcome
- [ ] Share with 5 close friends who lift — DM them personally, not in a group

---

## Hour 1-4: Direct Outreach (highest conversion)

### WhatsApp DMs (target: 30 personal messages)

**Template A — for friends who lift:**
> I built something. Enter your squat/bench/deadlift and it tells you where you rank against 3,200+ competitive lifters. Takes 20 seconds.
>
> [link]
>
> Founding members get the full diagnosis system when it launches. No payment until then.

**Template B — for gym acquaintances:**
> Quick question — do you know your competitive percentile for your lifts? I built a tool that benchmarks you against serious athletes in your weight class. Free, no signup.
>
> [link]

**Template C — for coaches/trainers you know:**
> Building a performance diagnosis system for serious strength athletes. It reads training + nutrition + recovery as one system to find what's actually limiting progress. Would love your feedback on the landing page.
>
> [link]

### Rules for DMs:
- Personal message, not group broadcast
- Send to people who actually train seriously
- Don't send more than one follow-up if they don't respond
- If they use the calculator, follow up: "What'd you get?"

---

## Hour 4-12: Community Seeding (highest volume)

### Reddit (primary)

**Target subreddits:**
- r/powerlifting (580k) — post as a tool, not a product
- r/strength_training (120k) — calculator angle
- r/IndianFitness or r/IndianStreetFit — if they exist, direct ICP match
- r/fitness (11M) — only if the post is genuinely useful, not promotional

**Reddit post template (r/powerlifting):**
> **Title:** I built a free tool that tells you where your SBD total ranks against competitive lifters in your weight class
>
> Been working on this for a while. You enter your squat, bench, deadlift (weight + reps), and it calculates your estimated 1RMs and competitive percentile against 3,200+ meet-calibrated records.
>
> No signup, no email, runs in your browser. Just enter your numbers.
>
> [link]
>
> Curious what people think. The percentiles are benchmarked against IPF-affiliated competition data, not general population.
>
> What did you get?

**Rules for Reddit:**
- Lead with the free calculator, not the product
- Be honest that you built it
- Respond to every comment within 1 hour
- Don't mention pricing or founding members in the post — let people discover that on the page
- If someone asks "what's the business model?" answer honestly: "Building a full diagnosis system — the calculator is step 1"

### WhatsApp Groups

**Target:** Gym groups, lifting groups, fitness communities you're already in

**Group message (only groups where you're an active member):**
> Made a free strength benchmarking tool — enter your lifts and see where you rank against 3,200+ competitive athletes in your weight class. No signup needed.
>
> [link]
>
> Drop your percentile below if you try it 💪

**Rules:**
- Only post in groups where people know you
- Don't spam multiple groups in the same minute
- Engage with responses

---

## Hour 12-24: Instagram Stories

### Story sequence (4 slides):

**Slide 1:** Your performance card image (from Share as Story)
Caption: "Top X% of competitive strength athletes"

**Slide 2:** Screenshot of the sample outcome (the diagnostic chain)
Caption: "This is what a full performance diagnosis looks like"

**Slide 3:** Screen recording of entering lifts and getting result (15 sec)
Caption: "Takes 20 seconds. No signup."

**Slide 4:** Link sticker to athleteos.io
Caption: "Check yours"

### Story rules:
- Post all 4 slides as a sequence, not spread across the day
- Add a "Add yours" sticker on slide 1 so friends can share their rank
- Re-share any friends who post their rank card

---

## Hour 24-48: X (Twitter)

### Launch tweet:
> Built a free tool that benchmarks your squat, bench, and deadlift against 3,200+ competitive lifters.
>
> Enter your numbers. Get your percentile. No signup.
>
> [link]
>
> What did you get?

### Thread (reply to your own tweet):
> The calculator is step 1 of something bigger.
>
> AthleteOS is a performance diagnosis system — it reads training, nutrition, and recovery as one system to find the one variable actually holding your progress back.
>
> Founding members get the full system when it launches. No payment until then.

### Rules:
- Tweet in the morning (8-10 AM IST) when gym crowd is active
- Quote-tweet anyone who shares their result
- Reply to every response

---

## Day 2-3: Referral Acceleration

### Activate the referral loop
- Message every founding member individually: "You can move up the list by sharing your invite link. 3 invites unlocks Elite tier."
- Share the top performers: "Founding Member #3 is already Top 8%. Where do you rank?"

### Create FOMO content
- Post founding member count updates: "12 founding members in 24 hours"
- Highlight interesting rank results (with permission): "An 85kg lifter just found out their bench is in the Top 4%"

---

## Tracking (check PostHog every 4 hours)

### Key metrics to watch:

| Metric | Target (72h) | Where to check |
|--------|-------------|----------------|
| Page views | 500+ | PostHog: $pageview |
| Calculator completions | 150+ | PostHog: rank_result_viewed |
| Calculator completion rate | 60%+ | rank_check_started → rank_result_viewed |
| Signup gate views | 100+ | PostHog: section_viewed(inline-signup-gate) |
| Signups | 50+ | PostHog: signup_conversion |
| Signup rate (from gate view) | 15%+ | signup_gate_viewed → signup_conversion |
| Calculator → signup rate | 25%+ | rank_result_viewed → signup_conversion |

### If calculator completions are low (<30% of page views):
- The page isn't pulling people to the calculator
- Check section_viewed drop-off: where do people stop scrolling?
- Consider making the hero CTA more prominent

### If signups are low (<10% of gate views):
- The gate isn't converting
- Check signup_form_focused — are people even starting the form?
- Check has_rank_result split — are calculator users converting better?
- If calculator users convert at 2x+ rate, focus on getting more people to use the calculator

### If referral rate is low:
- Message founders directly and ask them to share
- Make sharing feel like status, not obligation: "Your rank card is shareable — most people are curious where they stand"

---

## What NOT to do

- Don't buy ads on day 1 — your funnel isn't validated yet
- Don't post in communities where you're not a member
- Don't fake urgency ("only 10 spots left!") — your real founding member count is the scarcity
- Don't send mass WhatsApp broadcasts — personal DMs only
- Don't discount the founding rate — ₹2,999/year for 50 spots is the price, frame it as locked forever
- Don't explain the full product in the first message — lead with the free calculator
- Don't follow up more than once if someone doesn't respond

---

## Day 3+ Decision Points

**If you hit 50 founders:** You've validated demand. Start building the actual diagnosis system.

**If you hit 20-49:** Demand exists but distribution needs work. Double down on the channel that converted best.

**If you hit <20:** Either the ICP isn't finding you (distribution problem) or they're not converting (product/messaging problem). Check PostHog data before changing anything.
