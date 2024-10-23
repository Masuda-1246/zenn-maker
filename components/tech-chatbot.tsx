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
import { Send, FileText, RefreshCw, Loader2, Save } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatSession {
  messages: ChatMessage[]
}

interface BlogPost {
  title: string
  content: string
}

const STORAGE_KEY = "techChatbotSession"

export function TechChatbotComponent() {
  const [chatSession, setChatSession] = useState<ChatSession>({ messages: [] })
  const [inputMessage, setInputMessage] = useState("")
  const [blogTitle, setBlogTitle] = useState("")
  const [blogContent, setBlogContent] = useState("")
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false)
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false)
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false)
  const [generatedBlog, setGeneratedBlog] = useState<BlogPost | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY)
    if (storedSession) {
      setChatSession(JSON.parse(storedSession))
    }
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
    if (chatSession.messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSession))
    }
  }, [chatSession])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    const messages = chatSession.messages
    const updatedMessages = [...messages, newUserMessage]

    setInputMessage("")
    setChatSession(prevSession => ({
      ...prevSession,
      messages: [...prevSession.messages, newUserMessage],
    }))

    setIsGeneratingAnswer(true)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert('An error occurred. Please try again later.');
      console.error(data.error);
    }

    const newBotMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content:data.reply,
      role: "assistant",
      timestamp: new Date(),
    }

    setChatSession(prevSession => ({
      ...prevSession,
      messages: [...prevSession.messages, newBotMessage],
    }))

    setIsGeneratingAnswer(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const generateBlogPost = async () => {
    if (!blogTitle.trim()) return
    setIsGeneratingBlog(true)
    setIsBlogDialogOpen(false)

    const response = await fetch('/api/generateBlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatSession.messages }),
    });

    if (!response.ok) {
      alert('An error occurred. Please try again later.');
    }

    const data = await response.json();

    const generatedContent = data.content

    // --- ---で囲まれた部分を削除
    const content = generatedContent.replace(/---[\s\S]*?---/g, '')

    setGeneratedBlog({ title: blogTitle, content: content })
    setBlogContent(generatedContent)
    setIsGeneratingBlog(false)
  }

  const saveBlogPost = async () => {
    if (generatedBlog) {
      // ブログ記事を保存
      const saveResponse = await fetch('/api/saveBlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogTitle, blogContent }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        console.error(saveData.error);
      } else {
        console.log('ブログ記事が保存されました');
      }
      console.log("Saving blog post:", generatedBlog)
      alert("Blog post saved successfully!")
    }
  }

  const resetBlogPost = () => {
    setGeneratedBlog(null)
    setBlogTitle("")
    setBlogContent("")
  }

  const resetChat = () => {
    setChatSession({ messages: [] })
    localStorage.removeItem(STORAGE_KEY)
    setGeneratedBlog(null)
    setBlogTitle("")
    setBlogContent("")
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {chatSession.messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[70%] break-words ${
                    message.role === "user"
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {message.role === "user" ? (
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
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isGeneratingAnswer && (
              <div className="flex justify-center items-center my-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-blue-500">Generating answer...</span>
              </div>
            )}
            {isGeneratingBlog && (
              <div className="flex justify-center items-center my-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-blue-500">Generating blog post...</span>
              </div>
            )}
            {generatedBlog && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm max-w-none dark:prose-invert"
                >
                  {generatedBlog.content}
                </ReactMarkdown>
                <Button onClick={saveBlogPost} className="mt-4">
                  <Save className="mr-2 h-4 w-4" />
                  Save Blog Post
                </Button>
                <Button onClick={resetBlogPost} variant="destructive">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Blog Post
                </Button>
              </div>
            )}
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
            <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Blog Post</DialogTitle>
                </DialogHeader>
                <Input
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Enter blog post title"
                  className="mb-4"
                />
                <Button onClick={generateBlogPost}>Generate</Button>
              </DialogContent>
            </Dialog>
            <Button onClick={resetChat} variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Chat
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}