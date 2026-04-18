---
name: "gsc-indexing-strategy"
description: "Resolves Google Search Console 'Discovered/Crawled - currently not indexed' issues. Invoke when building SEO architecture, planning content, or fixing indexing errors."
---

# GSC Indexing Strategy (First Principles Approach)

This skill provides a framework for solving the two most common and frustrating Google Search Console (GSC) indexing issues. It uses First Principles thinking to understand Googlebot's behavior and provides actionable architectural and content strategies.

## 1. Discovered - currently not indexed (已发现 - 尚未编入索引)

### The First Principle (Google's Perspective)
"I know this URL exists (via Sitemap or backlinks), but I **do not want to waste my compute power (Crawl Budget)** visiting it right now. It seems unimportant, or my servers are too busy."

### Root Causes
- **Extremely low page authority/weight.**
- **Poor internal linking structure** (Google sees it as an "orphan page" or "low-value page").

### Actionable Solutions (Architecture & Code)
1. **Eliminate Orphan Pages**: Every page MUST be reachable from the homepage within a maximum of 3 clicks.
2. **Build a Powerful Internal Linking Network**:
   - **Breadcrumbs**: Every page must have clear breadcrumbs (e.g., `Home > 7-Day Bootcamp > Day 1`) injected with `Schema.org` JSON-LD data.
   - **Contextual Links**: Naturally link to other relevant articles within the body text.
   - **Sidebar/Footer Recommendations**: Enforce "Related Articles" or "Previous/Next" modules.
3. **Pass Homepage Authority**: The homepage must have a dedicated module (e.g., "Latest Resources" or "Bootcamp Index") that links directly to deep pages.

---

## 2. Crawled - currently not indexed (已抓取 - 尚未编入索引)

### The First Principle (Google's Perspective)
"I spent compute power to visit and read the HTML of this page, but I **decided NOT to put it in my search database**. The content provides no value to users, or there is already too much identical content on the internet."

### Root Causes
- **Thin Content** (Not enough text, just code/images).
- **Duplicate Content** (Machine translations, boilerplate text, or identical content on different URLs).

### Actionable Solutions (Content & Rendering)
1. **Reject "Thin Content"**: A page with just a few lines of code and a title will NOT be indexed. Enforce a minimum word count (e.g., 800+ words of explanatory text).
2. **Rich Media**: Require at least 1 explanatory image, diagram, or terminal screenshot per article.
3. **E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trustworthiness)**:
   - Frontmatter MUST include `author`, `publishedAt`, and `updatedAt`.
   - Render these clearly at the top of the page.
4. **Solve Duplicate Content**:
   - Use `<link rel="canonical" href="..." />` to declare the master version.
   - For multi-language sites, strictly configure `hreflang` tags in the `<head>` to tell Google these are independent, high-value localized pages, not spam translations.
5. **Differentiated Value**: Never just copy-paste official docs. Add "Troubleshooting", "Real-world use cases", or "Personal insights".

## How to Apply This Skill
When asked to build a new page, refactor a layout, or plan content, use this checklist:
- [ ] Does the layout include Breadcrumbs with Schema.org?
- [ ] Are there "Related/Next" links at the bottom?
- [ ] Is the content long enough and differentiated?
- [ ] Are `canonical` and `hreflang` tags correctly implemented?
- [ ] Are `author` and `date` metadata visible?