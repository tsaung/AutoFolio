-- =============================================================================
-- match_knowledge_chunks: vector similarity search function for RAG retrieval
-- Called via adminClient.rpc('match_knowledge_chunks', { ... })
-- =============================================================================

create or replace function match_knowledge_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  match_threshold float default 0.3
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index int,
  similarity float
)
language plpgsql
security definer
as $$
begin
  return query
    select
      kc.id,
      kc.document_id,
      kc.content,
      kc.chunk_index,
      1 - (kc.embedding <=> query_embedding) as similarity
    from knowledge_chunks kc
    inner join knowledge_documents kd on kd.id = kc.document_id
    where
      kd.status = 'active'
      and 1 - (kc.embedding <=> query_embedding) > match_threshold
    order by kc.embedding <=> query_embedding
    limit match_count;
end;
$$;
