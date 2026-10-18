# Urvi's Guide to Managing Your Portfolio Website 🌿

Welcome to your portfolio! This guide was written specifically for you so that you can easily update your projects, add new drawings, change text, and publish your work anytime—**without needing to know any code or contact anyone for help**.

---

## 📑 Table of Contents

1. [How to Open the Website & Log In](#1-how-to-open-the-website--log-in)
2. [Tour of Your Admin Dashboard](#2-tour-of-your-admin-dashboard)
3. [What to Prepare Before Adding a New Project](#3-what-to-prepare-before-adding-a-new-project)
4. [Step-by-Step: Adding a New Project](#4-step-by-step-adding-a-new-project)
5. [Uploading & Organizing Drawing Sheets](#5-uploading--organizing-drawing-sheets)
6. [Saving Drafts vs. Publishing Live](#6-saving-drafts-vs-publishing-live)
7. [Editing, Reordering, or Removing Existing Work](#7-editing-reordering-or-removing-existing-work)
8. [Troubleshooting & FAQs](#8-troubleshooting--faqs)
9. [Free-Tier Safeguards & Maintenance Tips](#9-free-tier-safeguards--maintenance-tips)

---

## 1. How to Open the Website & Log In

1. Open your web browser (Chrome, Safari, Edge, or Firefox) on your laptop or phone.
2. Go to your portfolio web address:
   - **Public Site:** `https://your-portfolio.pages.dev` (or your personal link)
3. Scroll down to the very bottom of any page (the footer) and click the small link that says **Admin Portal**, or simply type `/admin/login` at the end of the address in your browser bar.
4. Enter your registered email address and password, then click **Sign In to Dashboard**.
5. You will immediately be taken into your private **Management Console**.

> [!TIP]
> **Bookmark the link:** Add `https://your-portfolio.pages.dev/admin` to your browser bookmarks so you can jump in with one click whenever you finish a new project!

---

## 2. Tour of Your Admin Dashboard

When you log in, you will see a clean overview of your entire portfolio:

- **Total Projects:** How many projects exist in your database.
- **Published Live:** How many projects are currently visible to clients, teachers, or employers.
- **Drafts:** Projects you are still working on that the public cannot see yet.
- **Search Bar:** Quickly find any project by typing its name.
- **Category Filter:** Filter by Kitchen, Master Bedroom, Kids Bedroom, or General Spatial.
- **Project Table:** A list showing each project's preview thumbnail, title, sheet count, and publish status.

---

## 3. What to Prepare Before Adding a New Project

Before you sit down to create a new project, having these items ready will take less than 5 minutes:

1. **Project Title:** A clear title (e.g. *Artisanal Timber Library* or *Compact Studio Apartment*).
2. **Subtitle (Optional):** A short phrase explaining the concept (e.g. *Oak Acoustic Paneling & Hidden Joinery*).
3. **Category:** Choose whether it is a Kitchen, Bedroom, Kids Room, or General Spatial design.
4. **Short Description:** 1 or 2 sentences highlighting the purpose of the room. This appears on project cards.
5. **Full Project Story:** A few paragraphs explaining your spatial concept, client brief, or atmosphere.
6. **Cover Image:** The hero image that represents the project (JPEG, PNG, or WebP).
7. **Drawing Sheets / Renders:** The layout plans, elevations, sections, material swatches, or 3D views.

---

## 4. Step-by-Step: Adding a New Project

1. In the top right corner of your dashboard, click the black **+ New Project** button.
2. **Fill in the basic info:**
   - **Project Title:** Type the project name. The web address slug (e.g. `/artisanal-timber-library`) is created automatically for you.
   - **Category:** Pick the room type from the dropdown.
   - **Subtitle:** Enter your architectural tagline.
3. **Add the descriptions:**
   - **Short Description:** The brief summary for overview cards.
   - **Full Project Narrative:** The detailed explanation of your design choices.
   - **Atmospheric Concept (Optional):** Your thoughts on lighting levels, textures, or materials.
   - **Drafting Scales (Optional):** The scales used (e.g. `1:10 (Plan) / 1:2 (Joinery)`).
   - **Academic Term / Date (Optional):** When you completed the project (e.g. `Academic Studio 2026`).
4. **Choose your Cover Image:**
   - In the right-hand box, click **Upload Cover Image**.
   - Select the image file from your computer. A live preview will appear immediately.

---

## 5. Uploading & Organizing Drawing Sheets

Every interior design project has multiple drawing sheets (plans, elevations, schedules). You can upload them all together:

1. In the **Architectural Drawing Gallery** section, click **Upload Sheets**.
2. Select one or multiple images from your computer (JPEG, PNG, or WebP).
3. Once uploaded, each sheet will appear as a card in the list.
4. **Reorder sheets:**
   - Use the **Up** (↑) and **Down** (↓) arrow buttons next to each sheet to move it earlier or later in the presentation sequence.
5. **Add titles and scales:**
   - You can give each sheet a descriptive title (e.g. *Floor Plan & Circulation*, *Elevation Section AA*, *Appliance Schedule*).
   - You can specify the exact drafting scale for that sheet (e.g. `1:20`).
6. **Remove a sheet:** Click the red trash can icon on any card if you change your mind.

---

## 6. Saving Drafts vs. Publishing Live

You have full control over when the public can see your work:

- **Save Draft (Hidden):**
  - Click **Save Draft** at the top right.
  - The project is safely stored in your database, but **nobody visiting the website can see it**. You can take days or weeks to refine it before anyone knows it exists.
- **Publish Live (Visible):**
  - Click **Publish Live** at the top right (or toggle the status switch in the dashboard table).
  - The project immediately appears in your public portfolio and on your homepage!
- **Preview First:**
  - Click the **Preview** button at any time to open a realistic modal that shows you exactly how the project will look to visitors before you hit publish.

---

## 7. Editing, Reordering, or Removing Existing Work

- **To edit a project:** In your dashboard list, click the pencil icon (**Edit**) on that project. Make your changes and hit **Save**.
- **To change the homepage order:** In the dashboard table, use the **Up** and **Down** arrows in the leftmost column to arrange which projects appear first.
- **To unpublish:** Click the green **Published** badge in the table. It will turn into a grey **Draft** badge, and the project is instantly hidden from public visitors.
- **To delete a project:**
  - Click the trash can icon.
  - A confirmation window will appear asking: *"Are you sure you want to delete this project?"*
  - Click **Delete Project** to confirm, or **Cancel** if you clicked it by accident.

---

## 8. Troubleshooting & FAQs

### "I forgot my password. How do I get back in?"
- On the login screen (`/admin/login`), click **Forgot your password?**.
- Enter your email address and click **Send Reset Link**. Check your inbox for the password reset email from Supabase.

### "I tried to upload an image and got an error."
- **File size:** Images should be under **5 MB**. If your photo or render is huge (e.g. 20 MB from a raw DSLR camera), export it as a WebP or JPEG first. The website automatically resizes pictures larger than 2000px, but your browser has to be able to read the initial file.
- **File type:** Make sure the file ends in `.webp`, `.jpg`, `.jpeg`, or `.png`. PDF files should be exported into images before uploading.

### "I see an 'Administrator Authorization Required' message after logging in."
- This means your account is verified, but has not yet been added to the administrative allowlist in Supabase. Ask your developer friend to add your email to the `admin_users` table (it takes 30 seconds).

### "Do I have to worry about losing my work if I close the tab?"
- The editor will automatically pop up a browser warning if you try to close or leave the page with unsaved edits!

---

## 9. Free-Tier Safeguards & Maintenance Tips

Your portfolio runs on **100% free-tier services** (Supabase Free and Cloudflare Pages Free). To ensure it remains permanently free with $0 recurring fees:

1. **Storage Limits:** Supabase gives you **1 GB** of free storage. That is enough for over **4,000 optimized architectural sheets**! To keep file sizes small, export renders as high-quality WebP or JPEG instead of raw uncompressed TIFFs.
2. **Database Backups:** Supabase automatically keeps daily database backups. If you ever want to export a copy of all your projects, your developer friend can download a JSON snapshot in one click.
3. **Sharing on Your Resume:** Your link is fast, mobile-friendly, and works on all smartphones, tablets, and computers. Include it at the top of your CV:
   `https://your-portfolio.pages.dev`

---

*Enjoy sharing your architectural portfolio, Urvi! If you ever need technical help, refer your developer to the main `README.md`.*
