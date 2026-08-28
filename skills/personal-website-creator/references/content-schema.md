# Personal Website Content Schema

Use this schema to map user-provided content into Hand-drawn Paper, Pixel Folder, or Monochrome Editorial templates.

## Shared User Input

```js
const siteContent = {
  style: "handdrawn-paper", // "handdrawn-paper", "pixel-folder", or "monochrome-editorial"
  hero: {
    name: "Your Name",
    introLine1: "一句简短说明你的职业、身份或创作方向。",
    introLine2: "一句补充说明你的理念、兴趣或正在探索的主题。",
    stamp: "PORTFOLIO / CREATIVE / PERSONAL"
  },
  works: [
    {
      title: "作品项目一",
      description: "用一到两句话介绍这个作品解决的问题、特色或成果。",
      image: "/works/work-01.png",
      category: "作品类型",
      type: "Project Type",
      tags: ["标签一", "标签二"],
      year: "2026",
      link: "",
      detail: ""
    }
  ],
  about: {
    name: "Your Name",
    profileImage: "/about/profile.png",
    body: "用一段自然的第一人称文字介绍你是谁、你关注什么、你希望别人通过这个网站了解什么。",
    skills: ["能力一", "能力二", "兴趣方向", "创作主题", "专业领域"]
  },
  experiences: [
    {
      role: "本科",
      period: "UNDERGRAD",
      organization: "学校或组织 · 专业方向",
      description: "概括这段经历中的学习、项目、职责、成果或成长。",
      visual: "本科"
    }
  ],
  contact: {
    phoneHref: "tel:00000000000",
    phoneText: "000-0000-0000",
    emailHref: "mailto:hello@example.com",
    emailText: "hello@example.com"
  }
};
```

Rules:
- Preserve user-provided order for works and experiences.
- Keep masked values masked if the user provides masked phone/email.
- If full phone or email is provided, update both href and visible text.
- Put user images in `public/works/` or `public/about/` and reference them as root-relative paths.

## Hand-drawn Paper Mapping

Template: `assets/handdrawn-paper/template/`.

Visual identity to preserve:
- cream paper background
- centered handwritten `brand`
- hand-drawn hero doodles
- thick outline browser-style work cards
- note-card about layout
- large poster-like Contact card

Replace points — **all user content lives in `src/content.js`**:
- `content.hero`: `brand`, `eyebrow`, `name`, `introLine1`, `introLine2`, `introLine3`.
- `content.workSection`: selected work section eyebrow/title.
- `content.works`: browser-style work cards (see object shape below).
- `content.aboutSection`: about section eyebrow/title.
- `content.about`: `name`, `profileImage`, `profileAlt`, `body`.
- `content.skills`: about tag cloud.
- `content.experiences`: `role`, `company`, `period`, `detail`.
- `content.contact.items`: `PHONE` and `EMAIL` rows.
- `content.footer`: footer line.
- **`index.html`**: also update the static `<title>` and meta `description` with the user's name/role when generating a site.

Hand-drawn Paper work object:

```js
{
  title: "作品项目一",
  type: "Project Type",
  year: "2026",
  description: "用一到两句话介绍作品...",
  detail: "补充说明项目背景、你的贡献、设计或实现亮点...",
  tags: ["标签一", "标签二", "标签三"],
  color: "yellow", // cycle through blue, yellow, green, pink
  image: "/works/work-01.png"
}
```

Hand-drawn Paper experience object:

```js
{
  role: "职位或身份",
  company: "公司或组织 · 方向",
  period: "WORK",
  detail: "概括这段经历中的职责、贡献、成果或能力沉淀。"
}
```

## Pixel Folder Mapping

Template: `assets/pixel-folder/template/`.

Visual identity to preserve:
- pastel gradient background and grain
- rounded pill nav
- large italic display title
- folder-style work cards and hover detail paper
- postage-paper profile card
- central-axis personal experience timeline
- large Contact page with horizontal contact rows

Replace points — **all user content lives in `src/content.js`**:
- `content.hero`: `stamp`, `name`, `introLine1`, `introLine2`.
- `content.workSection`: selected work section eyebrow/title/description.
- `content.projects`: folder work cards and hover detail paper.
- `content.aboutSection`: about section eyebrow/title.
- `content.about`: `name`, `profileImage`, `profileAlt`, `postcardImage`, `greeting`, `body`.
- `content.skills`: reserved skill/tag list for generated content consistency.
- `content.experiences`: personal experience timeline.
- `content.contact`: `titleLine1`, `titleLine2`, `lead`, `phoneHref`, `phoneText`, `emailHref`, `emailText`.
- **`index.html`**: also update the static `<title>` and meta `description` with the user's name/role when generating a site.

Pixel Folder project object:

```js
{
  title: "作品项目一",
  description: "用一到两句话介绍作品...",
  image: "/works/work-01.png",
  category: "作品类型",
  tags: ["标签一", "标签二"],
  year: "2026",
  link: "",
  detail: "",
  folderIcon: ""
}
```

Pixel Folder experience object:

```js
{
  role: "职位或身份",
  period: "WORK",
  meta: "公司或组织 · 方向",
  description: "概括这段经历中的职责、贡献、成果或能力沉淀。",
  visual: "WORK"
}
```

## Monochrome Editorial Mapping

Template: `assets/monochrome-editorial/template/` (React 19 + Vite + Motion + Lenis).

Visual identity to preserve:
- monochrome editorial / Swiss look: paper-white & ink, hairline rules, numbered sections
- oversized tight hero title with a monochrome "orb" focal element
- custom cursor, grain overlay, keyword marquee
- Lenis smooth scrolling + motion (staggered hero entrance and scroll reveals)
- editorial work rows with a cursor-following grayscale preview
- two-column about: profile card (grayscale avatar + postcard) and a vertical dot timeline
- contact with a giant title and phone/email rows

Replace points — **all user content lives in a single file: `src/content.js`** (do not edit components for content):
- `content.hero`: `brand`, `stamp`, `name`, `introLine1`, `introLine2`, `location`, `availability`.
- `content.marquee`: keyword/skill list for the ticker.
- `content.works`: work rows (see object shape below). `image: ""` shows a monochrome CSS cover; an image path is auto-grayscaled.
- `content.about`: `profileName`, `profileImage`, `postcardImage`, `fromLabel`, `toLabel`, `greeting`, `body`.
- `content.experiences`: vertical timeline entries (see object shape below).
- `content.contact`: `lead`, `phoneHref`, `phoneText`, `emailHref`, `emailText`.
- **`index.html`**: also update the static `<title>` and meta `description` with the user's name/role — these are plain HTML and are NOT driven by `content.js`. (Default placeholder: `Personal Portfolio`.)

Images:
- Placeholders ship at `public/about/profile-placeholder.svg` and `public/about/postcard-placeholder.svg`. Drop real images into `public/about/` and point `about.profileImage` / `about.postcardImage` at them.
- Work images go in `public/works/` (e.g. `/works/work-01.png`); set `image` on the work object.

Monochrome Editorial work object:

```js
{
  id: "01",
  title: "作品项目一",
  desc: "用一到两句话介绍作品...",
  category: "作品类型",
  tags: ["标签一", "标签二"],
  image: "",        // "" → monochrome cover; "/works/work-01.png" → auto-grayscale image
  year: "20XX",     // optional
  href: "#"         // external "https://…"; "#" if none
}
```

Monochrome Editorial experience object:

```js
{
  year: "20XX",
  period: "实习 · Internship",
  role: "职位或身份",
  company: "公司或组织",
  tags: ["标签一", "标签二"],
  desc: "概括这段经历中的职责、贡献、成果或能力沉淀。"
}
```
