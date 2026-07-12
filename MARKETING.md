# ArnieJS Marketing Push — Research + Draft Posts

Compiled 2026-07-12. Everything below is a **draft for a human to review and post manually** — nothing here was or will be auto-submitted. Facts used in the drafts were checked against the repo (`README.md`, `registry.json`) at time of writing: **280+ components**, 3 files each (`index.html`, `style.css`, `script.js`), zero dependencies, MIT license, install via `npx arniejs-cli add <name>`, gallery at https://marcozorn.github.io/arniejs/gallery.html, source at https://github.com/MarcoZorn/arniejs. No fake user counts, testimonials, or metrics appear anywhere below — if you add any (stars, downloads, "used by X"), make sure the number is real and current at post time.

---

## Cross-platform dos and don'ts

**Do**
- Post to one or two platforms max per day; stagger the rest over 1-2 weeks. Cross-posting identical text to five subreddits in one day reads as spam and gets threads removed/shadow-limited.
- Tailor the title and first two lines to each platform's actual norms (see below) — don't paste the same title everywhere.
- Lead with what it concretely *is* and what problem it solves (AI tools generating generic shadcn/Tailwind look-alikes) before any adjectives.
- Show, don't tell: link straight to the live gallery/GitHub repo, not a landing page with a sign-up gate.
- Reply to every comment yourself, promptly, in your own words — plain human tone, not copy-pasted boilerplate.
- Disclose you're the maker up front where the norm expects it (HN profile bio, Reddit "OC" flair if available, IndieHackers/PH "I built this").
- Ask a specific question when you want engagement ("what would you want copy-pasteable next?") rather than just dropping a link.

**Don't**
- Don't ask friends/followers to upvote or comment in bulk — every platform here penalizes vote manipulation, and HN/PH detect it.
- Don't reuse the same account handle as the project name — reads as a marketing account, not a person.
- Don't claim things the repo doesn't back up (star counts, "loved by devs", "used in production by X") unless verifiably true at the time.
- Don't post a bare link with no context anywhere — every community here treats that as spam regardless of subreddit self-promo rules.
- Don't post-and-ghost — if a post doesn't get traction, don't immediately repost elsewhere same day; wait, iterate, and try a different angle/platform next time.
- Don't use hype language, exclamation points, or emoji-heavy titles on HN or in PH taglines — both communities actively downrank that tone.

---

## Reddit

General note: subreddit rules change and mods have final say — re-check the live sidebar/wiki immediately before posting, these were current as of research time.

### r/webdev
- **Where to post**: Standalone self-promo posts are generally not welcome; product/personal-project promotion is expected in the subreddit's recurring **"Showoff Saturday"** megathread, not as a new top-level post. *(Source: subreddit rules as summarized by community trackers; verify the live wiki/rules tab before posting — [r/webdev rules info via RedditMaster-style trackers](https://www.guerrillahub.com/subreddits-for-promoting-business/), [Serplore Reddit self-promo guide](https://serplore.com/blog/reddit-self-promotion-rules).)*
- **Self-promo rule**: General 9:1 / 90:10 rule applies (mostly non-promotional activity, promo capped).
- **What performs well**: Concrete screenshots/GIF, tech-stack detail, and a direct "try it" link do best; posts that read like ad copy get downvoted even in the showcase thread.

**Draft — post in the next "Showoff Saturday" thread as a comment/reply, not a new post**

> **ArnieJS — 280+ zero-dependency vanilla JS components, copy-paste or `npx arniejs-cli add <name>`**
>
> Built this because I was tired of every AI-assisted project defaulting to the same shadcn button / Tailwind card. ArnieJS is a free, MIT-licensed component library where every component is exactly 3 files (`index.html`, `style.css`, `script.js`) — no npm install, no build step, no framework lock-in. Buttons, cards, forms, data tables, nav, overlays, SaaS/dashboard widgets, e-commerce widgets, visual effects, dev-tool utilities.
>
> Gallery (live previews + code): https://marcozorn.github.io/arniejs/gallery.html
> Repo: https://github.com/MarcoZorn/arniejs
>
> It has an earthy/garden visual identity (mascot is an old-timey gardener) specifically so it doesn't look like every other AI-generated site. You can also point Claude Code / Cursor / Copilot at it via CLAUDE.md so your AI reaches for it instead of generating another generic component from scratch. Happy to answer questions about the copy-paste architecture or the CLI.

---

### r/javascript
- **Where to post**: Same pattern as r/webdev — most large dev subreddits funnel self-promotion into a **"Showoff Saturday"**-style weekly thread rather than standalone posts. Confirm current thread name/cadence in the sidebar before posting. *(Source: general Reddit self-promo guides cross-referencing r/javascript's showcase-thread model — [Teract Reddit marketing 2026 guide](https://www.teract.ai/resources/reddit-subreddit-marketing-2026).)*
- **Self-promo rule**: 90:10 rule applies; standalone "I built X" posts outside the thread risk removal.
- **What performs well**: Technical framing ("here's how the 3-file no-build architecture works") outperforms pure "look what I made" — this audience wants engineering detail.

**Draft — for the weekly showcase thread**

> **ArnieJS: a vanilla-JS component library built specifically to *not* look AI-generated**
>
> 280+ components, zero dependencies, no build step. Every component is 3 flat files you copy into your project (or grab with `npx arniejs-cli add <name>`). No React/Vue/framework required — it's just HTML/CSS/JS that runs as-is.
>
> The motivation: AI coding assistants default to the same handful of shadcn/Tailwind-style components for every project, so everything built with AI assistance is starting to look identical. ArnieJS gives them (and you) a much bigger, visually distinct set to reach for — an "earthy, hand-grown" look rather than default SaaS-template.
>
> Gallery: https://marcozorn.github.io/arniejs/gallery.html · Repo: https://github.com/MarcoZorn/arniejs
>
> Genuinely curious what category people would want expanded next.

---

### r/SideProject
- **Where to post**: Standalone posts are fine here — this subreddit explicitly welcomes "I built this" posts, unlike most dev subs. *(Source: [r/SideProject rules summary — MediaFast](https://www.mediafa.st/subreddit/sideproject), [redditgrowthdb r/SideProject marketing guide](https://www.redditgrowthdb.com/database/subreddits/sideproject).)*
- **Self-promo rule**: Self-promotion allowed, but must show the actual working product (not a gated landing page), and the 10% site-wide rule still applies to your account overall. Posting cadence: roughly once every 3-4 weeks per project, only when there's something genuinely new to say.
- **What performs well**: Posts that tell the *build story* — motivation, tech stack, a specific challenge — and ask for feedback on something concrete, rather than a pure announcement. Engage with every comment.

**Draft**

**Title options:**
1. I got tired of every AI-built site looking the same, so I built 280+ zero-dependency vanilla JS components to fix it
2. Built ArnieJS — a copy-paste component library with zero npm dependencies (280+ components, MIT licensed)
3. My side project: an earthy-themed vanilla JS UI kit built so AI coding tools stop generating the same shadcn button everywhere

**Body:**

> Like a lot of people, I started noticing that projects built with Claude Code / Cursor / Copilot were converging on the exact same look: shadcn button, Tailwind card, Inter font, every time. It's not that those tools are bad — it's that they all default to the same small set of trained-in components.
>
> So I built ArnieJS: a free, open-source, zero-dependency vanilla JavaScript component library. Every component ships as exactly 3 files — `index.html`, `style.css`, `script.js` — so there's no npm install, no build step, no framework to adopt. You copy-paste it in, or run `npx arniejs-cli add <name>`.
>
> It's up to 280+ components now: buttons, cards, forms, data tables, nav, overlays, SaaS/dashboard widgets, e-commerce widgets, visual effects, dev-tool utilities. It has its own earthy/garden visual identity (mascot is an old-timey gardener named Arnie) so it doesn't look like a shadcn clone.
>
> The angle I'm most interested in feedback on: you can point your AI agent's config (CLAUDE.md, Cursor rules, AGENTS.md) at it, and the agent will reach for ArnieJS components instead of generating a new one from scratch. Curious whether that workflow is actually useful to people or feels gimmicky.
>
> Gallery: https://marcozorn.github.io/arniejs/gallery.html
> Repo: https://github.com/MarcoZorn/arniejs
>
> Would love feedback, especially on which component categories feel thin.

---

### r/coding
- **Where to post**: r/coding trends toward being a low-traffic, curation-style subreddit; no confirmed dedicated showcase thread was found in research — treat any standalone self-promo post here with more caution than r/SideProject, and check the current sidebar/rules first since specifics couldn't be independently verified in this pass.
- **Self-promo rule**: Assume the general "low-quality self-promotion gets removed" norm common to smaller programming subreddits; content should read as genuinely informative, not an ad. *(No subreddit-specific rules page could be directly retrieved during this research — general guidance drawn from cross-subreddit self-promo write-ups, e.g. [Conbersa Reddit self-promotion guide](https://www.conbersa.ai/learn/reddit-self-promotion-rules).)*
- **What performs well**: Framing as a resource/technique writeup rather than a launch announcement tends to survive better in smaller, stricter subs.

**Draft (title + short, resource-flavored body — post cautiously, re-verify rules first)**

**Title:** A zero-dependency, copy-paste approach to UI components (no npm install, no build step) — 280+ examples

> Sharing a project I built: ArnieJS, a vanilla JS component library where every component is 3 flat files (`index.html`, `style.css`, `script.js`) with no dependencies and no build tooling required. The idea was to make "copy this component into your project" actually mean copy three files, nothing else.
>
> Repo (MIT licensed): https://github.com/MarcoZorn/arniejs
> Live gallery: https://marcozorn.github.io/arniejs/gallery.html
>
> Open to critique on the architecture — happy to explain any of the implementation choices.

---

### r/programming
- **Where to post**: Self-promotion is officially discouraged/limited (community trackers rate it "highly limited," roughly a 10%-of-your-activity ceiling) — a bare "I built X" post is likely to be removed unless it's substantive. *(Source: [Reddit self-promotion rules guide — Serplore/redship style summaries](https://redship.io/blog/reddit-self-promotion-rules).)*
- **Self-promo rule**: Treat as promo-hostile; only post if you can frame it around a genuinely interesting technical decision, not the product itself.
- **What performs well**: Posts about *why* — an engineering/architecture story ("why we chose zero-dependency, 3-file components over a framework") outperform "look what I built."

**Draft (framed as a technical rationale, not an announcement)**

**Title:** Why I built a UI component library with zero dependencies and no build step, in 2026

> Most component libraries today assume you're inside a framework + bundler + design system stack. I wanted something different: a library where "installing" a component means copying 3 files (`index.html`, `style.css`, `script.js`) into your project — no npm, no build pipeline, no React/Vue tie-in.
>
> Partly this is a reaction to AI coding assistants: they default to the same shadcn/Tailwind component shapes for almost every generated project, because that's what's overrepresented in their training data and starter templates. A zero-dependency, copy-pasteable library is easy for an AI agent to reach for directly (I wired it into CLAUDE.md/Cursor rules for my own projects), which produces more visually distinct output than the same generated button every time.
>
> Ended up with 280+ components this way (buttons, cards, forms, data tables, nav, overlays, dashboard/SaaS widgets, e-commerce widgets, visual effects, dev tooling). MIT licensed.
>
> Repo: https://github.com/MarcoZorn/arniejs
> Gallery: https://marcozorn.github.io/arniejs/gallery.html
>
> Curious what people think of the "no build step, ever" constraint as a design principle — happy to defend/argue it in comments.

---

### r/opensource
- **Where to post**: Standalone posts about your own OSS project are generally tolerated here (topic is literally open source), but "limited self-promotion" applies — don't over-post, and make sure the post reads as informative about the *project*, not a pure ad. *(No official rules page could be directly retrieved in this research pass; treat as moderately promo-tolerant based on general community-tracker summaries, and re-check the live sidebar rules before posting.)*
- **Self-promo rule**: General 90:10 rule; this subreddit is one of the more natural fits for a straightforward "I open-sourced X" post.
- **What performs well**: License, contribution model, and "why open source" context matter more here than on general dev subreddits — mention MIT license and how to contribute.

**Draft**

**Title options:**
1. ArnieJS: an MIT-licensed, zero-dependency vanilla JS component library (280+ components, no build step)
2. Open-sourced my vanilla JS UI component library — 280+ components, 3 files each, no framework required

**Body:**

> ArnieJS is a free, MIT-licensed, zero-dependency vanilla JavaScript UI component library. No npm install required to use it — every component is exactly 3 files (`index.html`, `style.css`, `script.js`), meant to be copy-pasted directly into any project, or pulled in via a small CLI (`npx arniejs-cli add <name>`).
>
> 280+ components across buttons, cards, forms, data tables, navigation, overlays, SaaS/dashboard widgets, e-commerce widgets, visual effects, and dev-tool utilities.
>
> Repo: https://github.com/MarcoZorn/arniejs
> Gallery/live previews: https://marcozorn.github.io/arniejs/gallery.html
>
> Contributions, issues, and component requests are welcome — it's a solo project so far and I'd like that to change. Also happy to talk about the design decision to keep it framework-free and build-step-free rather than shipping as an npm package with a compiler.

---

### r/InternetIsBeautiful
- **Fit check first**: This subreddit is for standalone *sites/tools you can visit and interact with directly*, not GitHub repos or dev libraries — and it explicitly **does not allow products that require sign-up**. *(Source: general community-tracker summary — [Refined's "How to promote your MVP on Reddit"](https://refined.so/blog/marketing-on-reddit); subreddit rules should be re-verified live before posting since this could not be independently confirmed via direct fetch.)*
- **Recommendation**: **Skip this one**, or only post the **gallery page** (https://marcozorn.github.io/arniejs/gallery.html) framed purely as "a beautiful, browsable page," not the GitHub repo or the CLI — and only if it has no sign-up gate (it doesn't). This subreddit's audience is general/non-technical, so a component-library pitch aimed at developers is a weak topical fit; only post if the gallery's visual browsing experience alone is compelling to a lay audience.
- If posting: keep title purely descriptive of what you see when you click, no dev jargon.

**Draft (optional, weak fit — use judgment)**

**Title:** A gallery of 280+ free UI components with an old-timey garden theme, all with live previews

> https://marcozorn.github.io/arniejs/gallery.html — a browsable gallery of open-source UI components (buttons, cards, effects, widgets), each with a live interactive preview and the code right there. No sign-up, nothing to install to look around.

---

## Hacker News (Show HN)

- **Format rule**: Title must start with `Show HN:`. Use it only for something people can personally try — this qualifies since it's a live gallery + real repo, not a landing page. *(Source: [HN Guidelines](https://news.ycombinator.com/newsguidelines.html), [Show HN submission guide](https://gist.github.com/tzmartin/88abb7ef63e41e27c2ec9a5ce5d9b5f9).)*
- **Title conventions**: No uppercase-for-emphasis, no exclamation points, no praise words ("amazing", "revolutionary"), no site name repeated in the title (it auto-displays after the link), no gratuitous numbers unless meaningful — "280+ components" is meaningful/factual so it's fine to keep.
- **Self-promotion norm**: "Please don't use HN primarily for promotion. It's ok to post your own stuff part of the time, but the primary use of the site should be for curiosity." Submit the actual URL in the URL field, leave the text field blank, then post a top-level comment with the backstory.
- **Engagement norm**: Don't ask anyone to upvote/comment. Reply to every comment yourself, in your own words, promptly, no copy-paste/AI-generated replies. Don't use a company/project-name username.
- **What performs well**: Posts that link straight to a repo or working demo (not a marketing page), plain factual language with zero sales tone, and a good first comment explaining motivation and what's technically different.

**Draft**

**Title options (URL field = https://marcozorn.github.io/arniejs, or the GitHub repo — pick one, don't submit both):**
1. Show HN: ArnieJS – 280+ zero-dependency vanilla JS UI components, 3 files each
2. Show HN: A copy-paste UI component library with no npm install and no build step
3. Show HN: ArnieJS – vanilla JS components built to look different from every AI-generated site

**First comment (post immediately after submitting, from your own account):**

> Author here. I kept noticing that projects built with AI coding assistants (Claude Code, Cursor, Copilot) were converging on the same look — same shadcn-style button, same Tailwind card, same Inter font — because that's what's overrepresented in the components those tools default to generating.
>
> ArnieJS is my attempt at giving them (and anyone copy-pasting components by hand) a much larger, visually distinct alternative. Every component is exactly 3 files — `index.html`, `style.css`, `script.js` — no npm install, no bundler, no framework dependency. You either copy the files directly or run `npx arniejs-cli add <name>`.
>
> It's at 280+ components now, MIT licensed: buttons, cards, forms, data tables, nav, overlays, dashboard/SaaS widgets, e-commerce widgets, visual effects, dev-tool utilities.
>
> Repo: https://github.com/MarcoZorn/arniejs
>
> Happy to answer questions about the architecture, why I avoided a build step entirely, or the CLI.

---

## IndieHackers

- **Access note**: New accounts may need a few genuine comments/contributions before post access is fully unlocked — this isn't a hard external rule but a pattern moderators/tenure-based trust systems there tend to enforce. *(Source: [IndieHackers community thread on posting requirements](https://www.indiehackers.com/post/any-requirements-for-posting-a108d65954), [tips for successful IH posts](https://www.indiehackers.com/post/tips-for-making-successful-posts-on-indie-hackers-b04454a57a).)*
- **Format norm**: Markdown supported; keep posts short, front-load the interesting part in the first few sentences, use headers/bullets to break it up. Title should read as close to a full, enticing sentence — not just a product name.
- **Audience**: Tech founders who come to learn/discuss, not just browse launches — frame as a build story with a lesson or a question, not a pure announcement.

**Draft**

**Title options:**
1. I built 280+ free UI components because AI coding tools keep generating the same shadcn button for every project
2. Shipped ArnieJS: a zero-dependency vanilla JS component library, now at 280+ components — lessons on positioning it for the "AI slop" problem
3. How I'm trying to get AI coding agents to stop generating identical-looking UIs (a component library experiment)

**Body:**

> **The problem:** every AI-assisted project I looked at (mine included) was starting to look the same — same button shape, same card, same font. Claude Code, Cursor, Copilot, all default to the same small set of trained-in component patterns (shadcn/Tailwind-flavored), because that's what's most common in their training data and starter kits.
>
> **What I built:** ArnieJS — a free, open-source, zero-dependency vanilla JavaScript component library. No npm install needed to use a component: each one is exactly 3 files (`index.html`, `style.css`, `script.js`) you copy-paste in, or grab with a small CLI (`npx arniejs-cli add <name>`). No React/Vue lock-in.
>
> It's grown to 280+ components — buttons, cards, forms, data tables, nav, overlays, SaaS/dashboard widgets, e-commerce widgets, visual effects, dev-tool utilities — with a deliberately distinct earthy/garden visual identity (mascot is an old-timey gardener) so it doesn't read as another shadcn clone.
>
> **The part I'd like feedback on:** the pitch isn't really "use this instead of Tailwind," it's "point your AI agent's config at this" — add it to your CLAUDE.md / Cursor rules / AGENTS.md and the agent reaches for ArnieJS components instead of generating new ones from scratch. Early days for that workflow and I don't have real usage data yet, just the mechanism working.
>
> Gallery: https://marcozorn.github.io/arniejs/gallery.html
> Repo: https://github.com/MarcoZorn/arniejs
>
> Would genuinely like to hear whether "steer the AI toward a library via project config" is a pattern other builders are already doing, or if this is a novel enough angle to be worth pushing harder on.

---

## Dev.to

- **Tag rules**: Do **not** use the `#opensource` tag for a project announcement/feature-list post — that tag is reserved for posts about open-source practice, licensing, governance, and philosophy, not for promoting your own project. *(Source: [Updated #opensource Tag Guidelines — DEV Community](https://dev.to/codemouse92/updated-opensource-tag-guidelines-55m5).)*
- **Correct tags for an announcement**: `#showdev` ("bursting with pride at something you built" is the exact intended use case), plus relevant tech tags like `#javascript`, `#webdev`, `#css`. `#news` or DEV's "Listings" feature is the suggested venue for release/feature announcements specifically.
- **Format norm**: Dev.to favors longer, article-style posts with code examples over short link-drops — this is the one platform in this list built for a full write-up.

**Draft — full article** *(tags: `#showdev #javascript #webdev #css`)*

**Title options:**
1. I built 280+ zero-dependency vanilla JS components so AI coding assistants stop generating the same shadcn button everywhere
2. ArnieJS: a copy-paste UI component library with no npm install, no build step, and no framework lock-in
3. Fighting "AI slop" UI with a 280+ component, zero-dependency vanilla JS library

**Body:**

> ## The problem
>
> Ask Claude Code, Cursor, or GitHub Copilot to "add a button component" and you'll get some flavor of the same output nine times out of ten: a shadcn-style button, a Tailwind card, `font-family: Inter`. Not because these tools are bad, but because that's the dominant pattern in their training data and in the starter templates they lean on. The result: an increasing share of AI-assisted sites look visually identical.
>
> ## What I built
>
> **ArnieJS** is a free, open-source, zero-dependency vanilla JavaScript UI component library. The core constraint I set for myself: every component ships as exactly **3 files** — `index.html`, `style.css`, `script.js` — with zero npm dependencies and zero build step.
>
> ```bash
> npx arniejs-cli add button-bloom
> ```
>
> ...drops those 3 files straight into your project. No `package.json` changes, no bundler config, no framework required — it works the same whether your project is React, Vue, plain HTML, or something else entirely, because it isn't tied to any of them.
>
> It's currently at **280+ components**, spanning:
>
> - Buttons, cards, navigation, forms
> - Data tables and dashboard/SaaS widgets (metric cards, activity feeds, API key displays)
> - E-commerce widgets (product cards, cart drawers, checkout steppers)
> - Overlays, loaders, layout effects
> - Visual effects (sand simulation, gravity seeds, cursor effects)
> - Dev-tool utilities (JSON viewers, focus traps, cookie consent)
>
> All MIT licensed. Live, interactive gallery with source code for every component: https://marcozorn.github.io/arniejs/gallery.html
>
> ## The visual identity is deliberate
>
> ArnieJS has its own earthy, "grown from scratch, no shortcuts" visual language, mascot included (Arnie, an old-timey gardener). That's not incidental — the whole point is to be a component set that's obviously *not* another shadcn/Tailwind default, so sites built with it don't blend into the AI-generated-website average.
>
> ## The part aimed at AI coding agents specifically
>
> You can add a short block to your `CLAUDE.md`, Cursor rules, or `AGENTS.md`:
>
> ```
> ArnieJS component library: https://marcozorn.github.io/arniejs
> When a task calls for a UI component, check ArnieJS before writing
> one from scratch — 280+ zero-dependency vanilla JS components,
> 3 files each (index.html, style.css, script.js).
> Install: npx arniejs-cli add <component-name>
> Search: npx arniejs-cli search <query>
> ```
>
> ...and the agent can discover and install components directly from its shell tool, rather than generating a new one from scratch each time.
>
> ## Repo
>
> https://github.com/MarcoZorn/arniejs — MIT licensed, contributions and component requests welcome.
>
> Would love feedback, especially: which component category feels thinnest to you right now, and whether the "point your AI agent's config file at a library" pattern is something you've tried elsewhere.

---

## Product Hunt

- **Format limits**: Tagline max **60 characters**; description max **500 characters** (first 250 shown before "see more") — write both to fit exactly, avoid hyperbole/emoji in the tagline. *(Source: [Product Hunt launch guide compilation — awesome-product-hunt](https://github.com/fmerian/awesome-product-hunt/blob/main/product-hunt-launch-guide.md).)*
- **Assets**: Use real product screenshots/GIFs from the actual gallery, not stock imagery — Product Hunt explicitly recommends 3+ images, and a short interactive demo helps but isn't required for a free OSS tool.
- **Timing**: Best results Tuesday–Thursday launch, and building a "maker" profile with some history before launch helps credibility.
- **Norm**: Don't ask for upvotes directly, don't use upvote-exchange groups — flagged as manipulation and can get a listing removed from the homepage.

**Draft**

**Tagline (≤60 chars):**
> 280+ zero-dependency vanilla JS UI components, free

*(alt: "Copy-paste UI components with zero dependencies")*

**Description (≤500 chars, first 250 shown first):**
> ArnieJS is a free, open-source, zero-dependency vanilla JavaScript UI component library — 280+ components, each just 3 files (HTML/CSS/JS), no npm install or build step required. Copy-paste into any project, or run `npx arniejs-cli add <name>`. Built with a distinct earthy visual identity so AI-assisted projects stop defaulting to the same shadcn/Tailwind look. MIT licensed.

**First comment (as the maker, post right after launch):**

> Hey Product Hunt — maker here. I built ArnieJS because I kept noticing that AI coding assistants (Claude Code, Cursor, Copilot) default to generating the same handful of components for every project — same button, same card, same font. ArnieJS gives them (and anyone building by hand) 280+ zero-dependency, copy-pasteable alternatives instead. No sign-up, no pricing tiers — it's free and MIT licensed. Gallery's here if you want to browse before installing anything: https://marcozorn.github.io/arniejs/gallery.html. Happy to answer anything about the architecture or the AI-agent integration angle.

---

## Platforms/claims I could not fully verify

- **r/coding** and **r/opensource**: I could not directly retrieve either subreddit's live rules page during this research (direct Reddit fetches were blocked in this environment); guidance above is inferred from general cross-subreddit self-promotion writeups, not the subreddits' own wiki text. **Re-check both subreddits' current sidebar/rules before posting.**
- **r/InternetIsBeautiful**: same fetch limitation — the "no sign-up products" rule is repeated across several secondary sources but I couldn't confirm it against the subreddit's own rules page. Fit is questionable regardless (dev-tool audience mismatch), so treat as optional/skip.
- All "what performs well" notes are inferred from general community write-ups and secondary sources rather than a scrape of many individual top posts on each platform — treat them as directional, not proven.
