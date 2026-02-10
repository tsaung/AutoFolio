'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

export function ChatInterface() {
  const chat = useChat()
  // Manual state management for input
  const [input, setInput] = useState('')

  // Destructure with fallback
  const { messages = [], isLoading, append } = chat as any

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    if (append) {
      await append({ role: 'user', content: input })
      setInput('')
    } else {
      console.error('append function not available from useChat')
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border-x bg-background">
      <header className="p-4 border-b bg-card flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AutoFolio
        </h1>
        <div className="text-sm text-muted-foreground">
          Ask me anything about my work.
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
            <Bot className="w-12 h-12 mb-2 opacity-20" />
            <h2 className="text-2xl font-semibold text-foreground">Welcome!</h2>
            <p>I am an AI assistant representing this portfolio.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8 w-full max-w-lg">
              {['Tell me about your experience', 'What are your skills?', 'Show me your projects', 'Contact info'].map((prompt) => (
                <button
                  key={prompt}
                  className="p-3 text-sm border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-8 h-8 mt-1">
                {m.role === 'user' ? (
                  <>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-muted">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`rounded-lg p-3 max-w-[80%] text-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="prose dark:prose-invert prose-sm break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                      code: ({ ...props }) => (
                        <code className="bg-black/10 rounded px-1" {...props} />
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background sticky bottom-0">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[50px] max-h-[200px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSubmit()
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
