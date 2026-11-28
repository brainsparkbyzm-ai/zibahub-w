# ZibaHub — 100-employer acquisition playbook

**Campaign target:** recruit 100 real employer/company accounts before launch.  
**Important:** 100 is the prospecting target, not a guaranteed number of paying customers. A company becomes a qualified lead only after its website, trade hiring activity and decision-maker/contact route are checked. A paying member is counted only after an employer completes the agreed paid membership/checkout.

## Prospect pipeline

The companion CSV `sales/100-employer-prospect-pipeline.csv` contains 100 candidate companies:
- 35 US
- 30 UK
- 20 Canada
- 15 Europe

The list is a first-pass company prospect pool compiled from public construction contractor rankings and trade association/company directories. It is **not** a verified list of 100 companies currently hiring, and it does not contain guessed personal emails. Each record must be researched against the company's own website before outreach.

## Who to target first

Prioritise companies that:
1. Publish multiple electrician, HVAC, plumbing, welding, refrigeration, mechanical, maintenance or construction vacancies.
2. Operate in the US, UK or Canada initially; add European countries only where the job and qualification pages support that market.
3. Have a reachable recruitment, talent acquisition, HR, operations or owner/manager contact.
4. Are small/mid-sized regional contractors, specialist subcontractors or growing service companies. Large national contractors can be approached later because supplier onboarding and procurement cycles are longer.
5. Have a clear careers page or a recent vacancy. Do not pitch a job-posting package to an inactive business without first asking whether it expects to recruit.

## Sales offer — do not publish unapproved prices

Use existing ZibaHub job-posting/featured-placement checkout options where applicable. Do not invent a separate monthly membership price, discounts, guarantees or benefits until the owner approves the commercial terms and confirms the Stripe product/price IDs.

Suggested offer structure for owner approval:
- **Founding Employer:** early access, company profile, first job-posting opportunity, guided onboarding. Price and duration to be approved.
- **Recruitment Membership:** repeat job posting, company profile, candidate applications/contact workflow, and hiring visibility. Only promise features that are already live and supported.
- **Featured Vacancy:** a paid boost for an individual vacancy using the existing featured/sponsored product if it is configured and available.

Never promise a number of applicants, hires, rankings, backlinks or guaranteed job fills.

## Outreach sequence

1. Research the company's official site and one currently open trade vacancy.
2. Find the official hiring/contact route. Prefer the recruitment inbox, contact form or named business contact published by the company.
3. Send one personalised message explaining why ZibaHub's trade-specific audience may be relevant. Include the company profile and job-posting route.
4. Follow up once after 5–7 business days if no response. Stop if asked not to contact.
5. If interested, book a short demo/onboarding, verify employer identity and explain the actual plan, payment terms and cancellation terms before checkout.
6. After signup, help publish the first genuine vacancy and verify the apply link. Track first post, first application and renewal.

Respect applicable anti-spam/privacy rules in each market (including UK PECR/UK GDPR, Canadian CASL and US CAN-SPAM). Use business contact routes appropriately, identify ZibaHub, provide an opt-out where required, and keep a suppression list. Do not scrape personal emails or bulk-blast generic messages.

## Outreach email — first touch

**Subject:** Skilled-trades hiring on ZibaHub

Hello [Hiring Manager / Company Team],

I came across [Company] while researching employers hiring in [trade / region]. ZibaHub is a skilled-trades careers platform connecting employers with candidates exploring roles in areas such as electrical, HVAC, plumbing, welding and construction.

We are inviting a small group of employers to set up company profiles and try posting relevant vacancies ahead of our wider launch. The goal is to give trade employers a focused place to present genuine openings and reach candidates who are specifically exploring these careers.

Would you be the right person to speak with about recruitment advertising or employer partnerships at [Company]?

If useful, I can share the employer setup and current posting options. There is no obligation to proceed.

Regards,  
ZibaHub Employer Partnerships  
https://zibahub.vercel.app/

## Follow-up email

**Subject:** Re: Skilled-trades hiring on ZibaHub

Hello [Name],

Just following up on my note about ZibaHub. If [Company] expects to recruit electricians, HVAC technicians, plumbers, welders or other skilled-trades staff, I would be glad to show you the employer profile and job-posting process.

If hiring is not a priority at the moment, no problem—please let me know and I will close the loop.

Regards,  
ZibaHub Employer Partnerships

## Tracking stages

Use these exact statuses in the CSV:
- Prospect — name sourced, not yet checked.
- Qualified — official site and relevant hiring need verified.
- Contact found — official business contact route recorded.
- Contacted — first personalised message sent.
- Follow-up due — one follow-up date recorded.
- Interested — requested information/demo.
- Trial/onboarding — account created; employer verification in progress.
- First vacancy live — first real job published and apply route checked.
- Paid member — payment confirmed and membership terms accepted.
- Not a fit / Do not contact — stop outreach and record reason.

## Daily activity target (initial operating plan)

- Research and qualify 10 companies.
- Send 5–10 individually personalised first-touch messages, only where a suitable public business contact route exists.
- Follow up with due leads.
- Aim to book 2–3 employer conversations per week, then adjust based on actual reply rates.
- Review conversion after the first 25 contacted companies; do not assume a 100-lead list yields 100 paying members.

## Launch readiness gates

Before scaling outreach, verify:
- Employer signup and company-profile creation work end-to-end.
- Company profile moderation and verification are clear.
- Job posting, edit, expiry, external apply link and duplicate checks work.
- Membership/featured payment product, price, currency, renewal and cancellation terms are explicit.
- Employer can see what is included before paying.
- Support contact and refund/cancellation policy are visible.
- Admin can distinguish prospect, registered employer, published company, paid member and active vacancy.

## Sources used for initial prospect pool

- US ENR Top 100 contractor ranking (2026): https://www.constructionplacements.com/construction-companies-in-the-united-states/
- UK Glenigan Construction Review / contractor league table (2026): https://www.glenigan.com/wp-content/uploads/The-Glenigan-Construction-Review_May_2026_40043.pdf
- Canada HVAC company list: https://companydata.com/canada/hvac-companies-canada/
- Mechanical Contractors Association of Canada member directory: https://members.mcac.ca/member-directory/findstartswith
- German building services / HVAC company market list: https://markets.conclusia.io/en/building-services-and-electrical-hvac/

These are prospect discovery sources, not endorsements. Recheck company activity and contact routes before use.
