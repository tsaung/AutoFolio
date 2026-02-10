# System Overview

## Vision
**AutoFolio** is an AI-native portfolio platform.
- **Concept:** A "Personal RAG" application where the AI answers visitor questions based on the owner's enriched data.
- **Model:** Single-tenant, self-hosted (User owns the DB).

## Architecture
- **Framework:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL + Vector)
- **AI:** Vercel AI SDK (Core + React)
- **Styling:** Tailwind CSS + Shadcn UI
- **Deployment:** Vercel

## Core Principles
1.  **Collaborative Seniors:** We treat AI agents as senior engineers.
2.  **Living Specs:** Documentation is code. Keep it updated.
3.  **TDD:** Write tests to prove your code works.

## Directory Structure
- `src/app/(visitor)`: Public-facing pages (Portfolio, Chat).
- `src/app/(admin)`: Protected admin dashboard.
- `src/lib/db`: Database clients (Client, Server, Admin).
- `src/lib/ai`: AI utilities and prompts.
