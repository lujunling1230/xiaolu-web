---
name: personal-website-creator
description: Use when a user wants to create a React/Vite personal portfolio website from their profile, works, experiences, phone, and email, especially when they ask for a hand-drawn paper, pastel pixel folder, monochrome editorial, or selectable personal website template.
---

# Personal Website Templates

## Purpose

Create a personal portfolio website by copying one bundled React + Vite template, then replacing only the content with the user's information.

This skill currently supports:

| Style | Template path | Visual identity |
| --- | --- | --- |
| Hand-drawn Paper / 手绘纸感 | `assets/handdrawn-paper/template/` | cream paper, hand-drawn doodles, thick ink outlines, note cards, browser-style work cards, oversized contact cards |
| Pixel Folder / 粉彩像素文件夹 | `assets/pixel-folder/template/` | pastel pixel gradient, pill nav, large italic hero, folder work cards, postage-paper profile card, central-axis timeline |
| Monochrome Editorial / 黑白编辑部 | `assets/monochrome-editorial/template/` | monochrome editorial / Swiss: paper-white & ink, oversized tight type, hairline rules, numbered sections, vertical dot timeline, cursor-following work preview, smooth scroll (Lenis), motion reveals, grain |

Use this skill for requests like:
- "用手绘纸感风格给我做一个个人网页"
- "用粉彩像素文件夹风格给我做一个个人网页"
- "参考这个个人网站模板，换成我的个人信息"
- "做一个有作品集、关于我、个人经历、联系方式的个人网站"
- "我想从多个个人网站风格里选一个生成"
- "用黑白编辑部风格给我做一个个人网页"

## Non-Negotiables

- Default output goes inside this skill's own folder under `generated-sites/<site-slug>/`.
- If the user explicitly provides another output path, confirm whether to use that path or the default `generated-sites/` location.
- Ask which style to use only when the user did not specify a style. If they say "手绘纸感", "手绘", "hand-drawn", "paper", "cream paper", use Hand-drawn Paper. If they say "粉彩像素文件夹", "像素", "pixel", "postcard", "folder", use Pixel Folder. If they say "黑白编辑部", "黑白", "monochrome", "editorial", "Swiss", use Monochrome Editorial.
- Preserve the chosen template's fixed structure, layout, class names, and visual system. Replace content; do not redesign.
- Do not modify source templates in `assets/handdrawn-paper/template/`, `assets/pixel-folder/template/`, or `assets/monochrome-editorial/template/`. Copy first, then edit the copy.
- Do not copy `node_modules` or `dist` into generated sites.
- Keep project-level configuration inside each generated site folder.

## Inputs

The user may provide all or part of the content. If a field is missing, use tasteful placeholders rather than blocking unless the missing field is essential.

Read `references/content-schema.md` when you need exact field names and style-specific replace points.

Required content groups:
- Style choice: Hand-drawn Paper, Pixel Folder, or Monochrome Editorial.
- Hero: display name, first intro line, second intro line, optional stamp/eyebrow.
- Works: title, description, optional image, category/type, tags, optional year, optional link, optional detail.
- About: profile name, profile image, profile text, optional tags/skills.
- Experiences: ordered education/work/personal milestones.
- Contact: phone and email.

## Workflow

1. **Choose Style**
   - Use the user's explicit style if provided.
   - If absent, ask one concise question: "要用手绘纸感、粉彩像素文件夹，还是黑白编辑部？"
   - Set `templateRoot` to one of:
     - Hand-drawn Paper: `<skill-folder>/assets/handdrawn-paper/template/`
     - Pixel Folder: `<skill-folder>/assets/pixel-folder/template/`
     - Monochrome Editorial: `<skill-folder>/assets/monochrome-editorial/template/`

2. **Choose Output Folder**
   - Default root: `<skill-folder>/generated-sites/`.
   - Derive `<site-slug>` from the user's display name, e.g. `alex`, `zhang-san`, `user-site`.
   - If the slug already exists, create a timestamped or numbered folder such as `alex-20260709-1530` or `alex-02`; do not overwrite existing generated sites unless the user explicitly asks.
   - The final destination should be `<skill-folder>/generated-sites/<site-slug>/`.
   - To locate `<skill-folder>`, resolve the directory containing this `SKILL.md`.

3. **Copy Template**
   - Copy everything from `templateRoot` into the chosen generated site folder.
   - If the destination already has files, inspect first and avoid deleting user files unless asked.

4. **Install Dependencies**
   - In the generated site folder, run `npm install` if `node_modules` is absent.
   - Keep dependencies local to that generated site folder.

5. **Move User Assets Into Public**
   - Work images go under `public/works/`.
   - About/profile images go under `public/about/`.
   - Use stable lowercase filenames such as `work-01.png`, `profile.png`.
   - In React data, reference assets with root-relative paths such as `/works/work-01.png`.

6. **Replace Content In `src/content.js`**
   - Use `references/content-schema.md` for the chosen style's exact data shapes.
   - Update hero name and intro text.
   - Update works/projects array.
   - Update profile image, about text, and skills/tags if the style supports them.
   - Update experiences.
   - Update phone/email links and visible values.
   - Keep all user-facing content in `src/content.js` for Hand-drawn Paper, Pixel Folder, and Monochrome Editorial.
   - Keep component structure and class names unless a requested content change truly requires a local fit adjustment.
   - Also update the static `<title>` and meta `description` in `index.html` when present, because those values are not driven by React content.

7. **Preserve Style In `src/styles.css`**
   - Prefer minimal style tweaks for content fit.
   - For Hand-drawn Paper, preserve the cream paper, hand-drawn doodles, note cards, browser work cards, custom cursor, click sparks, reveal motion, and oversized contact cards.
   - For Pixel Folder, preserve the pastel gradient, folder cards, stamp-paper profile, timeline axis, contact rows, custom cursor, click sparks, reveal motion, and smooth scrolling.
   - For Monochrome Editorial, preserve the monochrome editorial system (paper/ink, hairlines, numbered sections), the hero orb, marquee, grain, custom cursor, Lenis smooth scrolling, motion reveals, vertical dot timeline, and cursor-following work preview.
   - If text overflows, adjust width, font size, or line-height locally.

8. **Verify**
   - Run `npm run build`.
   - If the user wants live preview, run `npm run dev -- --port <available-port>` from the generated site folder.
   - Check the chosen style's hero, work cards, about/experience layout, contact section, hover motion, smooth scrolling, and responsive layout.

## Output Expectations

Deliver a working React + Vite personal website with:
- Home page hero.
- Work section.
- About/profile section.
- Personal experience timeline/list.
- Contact section with phone and email.
- The chosen template's interaction quality.

After changes, report:
- chosen style
- generated site folder under `generated-sites/`
- key files changed
- whether `npm run build` passed
- preview URL if a dev server was started
