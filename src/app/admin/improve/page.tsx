'use client'

import { useState } from 'react'
import { Send, Bot, User, FileText, Code, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Here are my raw notes about my experience with Next.js. Can you structure this into a professional bio?',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'I have analyzed your notes. Here is a drafted bio focusing on your Next.js expertise. I have also tagged it with relevant skills in the preview panel.',
  },
]

const mockRagContext = `
# Generated Content: Professional Bio

## Summary
Senior Frontend Engineer with deep expertise in the React ecosystem, specifically **Next.js**. Proven track record of migrating legacy applications to modern architectures and improving performance metrics by over 40%.

## Key Highlights
- **Architecture:** Proficient in Next.js App Router, Server Components, and Edge Runtime.
- **Performance:** Optimized Core Web Vitals for high-traffic e-commerce platforms.
- **State Management:** Expert in integrating server state with client-side interactivity.

## Metadata
- **Source:** AI Generated (from User Notes)
- **Confidence:** High
- **Tags:** #NextJS, #React, #Performance
`

export default function ImprovePage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [model, setModel] = useState('gpt-4o')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages([...messages, newMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'This is a simulated response. The AI is using the selected model (' + model + ') to process your request and update the content preview.',
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden">
      {/* Left Pane: Chat Interface */}
      <section className="flex flex-1 flex-col rounded-xl border bg-background shadow-sm">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Content Enrichment Studio</h2>
          </div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
              <SelectItem value="gemini-1-5-pro">Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Paste notes or instructions to generate content..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Right Pane: Content Preview (Canvas) */}
      <section className="hidden w-[500px] flex-col rounded-xl border bg-muted/30 lg:flex">
        <header className="flex h-14 items-center justify-between border-b px-4 bg-background/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Live Preview
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="View Raw JSON">
                <Code className="h-4 w-4" />
            </Button>
             <Button variant="outline" size="sm">
                Save to Knowledge Base
            </Button>
          </div>
        </header>
        <ScrollArea className="flex-1 p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none bg-background p-6 rounded-lg border shadow-sm">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {mockRagContext}
            </pre>
          </div>
        </ScrollArea>
      </section>
    </div>
  )
}
