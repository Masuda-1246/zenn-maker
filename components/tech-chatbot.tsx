"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, PlusCircle, Send, FileText, MoreVertical } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  lastUpdated: Date
  messages: ChatMessage[]
}

export function TechChatbotComponent() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [newChatTitle, setNewChatTitle] = useState("")
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [currentSession?.messages])

  const createNewChat = () => {
    if (!newChatTitle.trim()) return

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: newChatTitle,
      lastUpdated: new Date(),
      messages: [],
    }
    setChatSessions([newSession, ...chatSessions])
    setCurrentSession(newSession)
    setNewChatTitle("")
    setIsNewChatDialogOpen(false)
  }

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentSession) return

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    const newBotMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: `You said:\n\n${inputMessage}\n\nHere's the message in markdown:\n\n\`\`\`markdown\n${inputMessage}\n\`\`\`\n\nAnd here's a table:\n\n| Column 1 | Column 2 |\n|----------|----------|\n| Row 1    | Data 1   |\n| Row 2    | Data 2   |`,
      sender: "bot",
      timestamp: new Date(),
    }

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newUserMessage, newBotMessage],
      lastUpdated: new Date(),
    }

    setCurrentSession(updatedSession)
    setChatSessions(
      chatSessions.map((session) =>
        session.id === currentSession.id ? updatedSession : session
      )
    )
    setInputMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const generateBlogPost = () => {
    console.log("Generating blog post...")
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-100 p-4">
          <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsNewChatDialogOpen(true)}
                className="mb-4 w-full"
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Start New Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat</DialogTitle>
              </DialogHeader>
              <Input
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Enter chat title"
                className="mb-4"
              />
              <Button onClick={createNewChat}>Add</Button>
            </DialogContent>
          </Dialog>
          <ScrollArea className="h-[calc(100vh-2rem)]">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className="mb-2 flex items-center justify-between rounded-lg p-2 hover:bg-gray-200"
                onClick={() => setCurrentSession(session)}
              >
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-xs text-gray-500">
                      {session.lastUpdated.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </aside>
        <main className="flex flex-1 flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {currentSession?.messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[70%] break-words ${
                    message.sender === "user"
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {message.sender === "user" ? (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-sm max-w-none dark:prose-invert break-words"
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
          <Separator />
          <div className="flex items-start gap-2 p-4">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a technical question (Shift+Enter for new line)"
              className="min-h-[60px]"
              rows={1}
            />
            <Button onClick={sendMessage}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button onClick={generateBlogPost} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Blog Post
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}