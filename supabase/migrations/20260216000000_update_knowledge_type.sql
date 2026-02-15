-- Update knowledge_documents type check constraint
ALTER TABLE public.knowledge_documents
DROP CONSTRAINT knowledge_documents_type_check;

ALTER TABLE public.knowledge_documents
ADD CONSTRAINT knowledge_documents_type_check
CHECK (type IN ('manual', 'ai_generated', 'auto_generated'));
