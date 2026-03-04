# Deploying BotFolio to Production

This guide walks you through deploying BotFolio to **Supabase Cloud** + **Vercel** — no local development setup required.

## Prerequisites

You will need the following accounts (all offer generous free tiers suitable for personal use):

- A [GitHub](https://github.com) account (to fork the repo)
- A [Supabase](https://supabase.com) account (Authentication, pgvector database)
- A [Vercel](https://vercel.com) account (Hosting)
- A [Sanity](https://sanity.io) account (Headless CMS for content management)
- An [OpenRouter](https://openrouter.ai) API key (for AI chat)
- A [Google AI Studio](https://aistudio.google.com) API key (for RAG embeddings)

> **⚠️ Pricing Disclaimer:** While you can run BotFolio completely for free, scaling past the free limits on these platforms may incur charges. Please monitor your usage limits in their respective dashboards.

## Step 1: Fork the Repository

1. Go to [github.com/tsaung/botfolio](https://github.com/tsaung/botfolio)
2. Click **Fork** (top right)
3. This creates your own copy of BotFolio

## Step 2: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose a name, password, and region
4. Wait for the project to spin up (~2 minutes)

### Get Your Keys

After creation, go to **Settings → API**:

- Copy **Project URL** (e.g., `https://xxxx.supabase.co`)
- Copy **Anon Key** (public)
- Copy **Service Role Key** (secret — treat like a password)

## Step 3: Push the Database Schema

You'll need the [Supabase CLI](https://supabase.com/docs/guides/cli) for this step.

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link to your cloud project
supabase link --project-ref YOUR_PROJECT_REF

# Push the schema
supabase db push
```

> **Tip:** Find your `project-ref` in your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

## Step 4: Create Your Admin User

1. In Supabase Dashboard, go to **Authentication → Users**
2. Click **Add User → Create New User**
3. Enter your email and a strong password
4. This will be your admin login

## Step 5: Deploy to Vercel

### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tsaung/botfolio)

### Option B: Manual Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your forked BotFolio repo
3. Configure the project (defaults are fine)
4. Add environment variables (see below)
5. Click **Deploy**

### Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable                        | Value                         | Where to Find                                             |
| ------------------------------- | ----------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxx.supabase.co`    | Supabase → Settings → API                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...`                   | Supabase → Settings → API                                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbG...`                   | Supabase → Settings → API                                 |
| `OPENROUTER_API_KEY`            | `sk-or-...`                   | [openrouter.ai/keys](https://openrouter.ai/keys)          |
| `GOOGLE_GENERATIVE_AI_API_KEY`  | `AIza...`                     | [aistudio.google.com](https://aistudio.google.com/apikey) |
| `NEXT_PUBLIC_SITE_URL`          | `https://your-app.vercel.app` | Your Vercel deployment URL                                |

## Step 6: Post-Deployment Setup

1. Visit your deployed URL
2. You'll see the setup checklist — click **Login**
3. Log in with the admin user you created in Step 4
4. Set up your **Profile** (name, profession, etc.)
5. Configure **Bot Settings** (system prompt, model)
6. Add your **Portfolio** content (projects, experiences, skills, social links)
7. Add **Knowledge Base** documents for richer AI responses

## Troubleshooting

### "Invalid API key" or blank page

→ Double-check your environment variables in Vercel. Redeploy after changes.

### Chat not responding

→ Verify your `OPENROUTER_API_KEY` is valid and has credits.

### RAG not working

→ Verify your `GOOGLE_GENERATIVE_AI_API_KEY` is valid and has access to embedding models.

### Database errors

→ Make sure you ran `supabase db push` successfully. Check the Supabase SQL Editor for any migration issues.
