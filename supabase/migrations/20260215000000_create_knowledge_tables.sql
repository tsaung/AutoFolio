-- Enable pgvector extension for vector similarity search
create extension if not exists vector with schema extensions;

-- =============================================================================
-- knowledge_documents: stores original user-provided content
-- =============================================================================
create table knowledge_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  type text not null check (type in ('manual', 'ai_generated')),
  metadata jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for RLS / user-scoped queries
create index idx_knowledge_documents_user_id on knowledge_documents(user_id);

-- Enable RLS
alter table knowledge_documents enable row level security;

-- Owner: full CRUD
create policy "Users can view own documents."
  on knowledge_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents."
  on knowledge_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents."
  on knowledge_documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents."
  on knowledge_documents for delete
  using (auth.uid() = user_id);

-- Public: read active documents only (needed for RAG context)
create policy "Public can view active documents."
  on knowledge_documents for select
  using (status = 'active');

-- =============================================================================
-- knowledge_chunks: stores derived vector embeddings for similarity search
-- Embedding model: google/gemini-embedding-001 @ 1536 dimensions
-- =============================================================================
create table knowledge_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references knowledge_documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  embedding vector(1536),
  chunk_index integer not null,
  token_count integer,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Index for RLS / user-scoped queries
create index idx_knowledge_chunks_user_id on knowledge_chunks(user_id);

-- HNSW index for fast cosine similarity search
create index idx_knowledge_chunks_embedding on knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

-- Enable RLS
alter table knowledge_chunks enable row level security;

-- Owner: full CRUD
create policy "Users can view own chunks."
  on knowledge_chunks for select
  using (auth.uid() = user_id);

create policy "Users can insert own chunks."
  on knowledge_chunks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chunks."
  on knowledge_chunks for update
  using (auth.uid() = user_id);

create policy "Users can delete own chunks."
  on knowledge_chunks for delete
  using (auth.uid() = user_id);

-- Public: read chunks (needed for RAG similarity search by visitors)
create policy "Public can view chunks."
  on knowledge_chunks for select
  using (true);
