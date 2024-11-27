/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Search, ChevronRight, Bot, Send, Copy, Trash2, Check, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useChat } from 'ai/react'
import { create } from 'zustand'
import { ClipLoader } from 'react-spinners'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ZoomableModal } from './zoomable-modal'
import TextareaAutosize from 'react-textarea-autosize'

import type { Message as AIMessage } from 'ai'

interface Message extends AIMessage {
  id: string;
  timestamp?: number;
}

interface ChatOption {
  id: string;
  title: string;
}

interface CV {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  education: any[];
  skills: any[];
  experience: any[];
  projects: any[];
}

const enhancementOptions: ChatOption[] = [
  { id: 'skills', title: 'Skills' },
  { id: 'experience', title: 'Experience' },
  { id: 'education', title: 'Education' }
]

interface ChatState {
  favorites: string[];
  messages: Message[];
  toggleFavorite: (message: string) => void;
  deleteMessage: (id: string) => void;
  addMessage: (message: Message) => void;
}

const useChatStore = create<ChatState>((set) => ({
  favorites: [],
  messages: [],
  toggleFavorite: (message: string) => set((state) => ({
    favorites: state.favorites.includes(message)
      ? state.favorites.filter((fav) => fav !== message)
      : [...state.favorites, message],
  })),
  deleteMessage: (id: string) => set((state) => ({
    messages: state.messages.filter((msg) => msg.id !== id),
  })),
  addMessage: (message: Message) => set((state) => ({
    messages: [...state.messages, message],
  })),
}))

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [cv, setCV] = useState<CV | null>(null)
  const [loading] = useState(false)
  const [cvLoading, setCvLoading] = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)
  const { favorites, toggleFavorite, deleteMessage, messages: storedMessages } = useChatStore()
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    onFinish: (message) => {
      const newMessage: Message = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      }
      useChatStore.getState().addMessage(newMessage)
    },
  })
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setCvLoading(true)
        const response = await fetch('/api/cv')
        if (response.ok) {
          const data = await response.json()
          console.log('Fetched CV:', data);

          setCV({
            id: data.id || '',
            personalInfo: typeof data.personalInfo === 'string' ? JSON.parse(data.personalInfo) : data.personalInfo || {},
            education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
              ...edu,
              id: edu.id || Date.now().toString(),
            })) : [],
            skills: Array.isArray(data.skills)
              ? data.skills.map((skillCategory: any) => ({
                  ...skillCategory,
                  id: skillCategory.id || Date.now().toString(),
                }))
              : data.skills && Array.isArray(data.skills.items)
                ? [{
                    id: data.skills.id || Date.now().toString(),
                    category: 'Skills',
                    items: data.skills.items
                  }]
                : [],
            experience: Array.isArray(data.experience) ? data.experience.map((exp: any) => ({
              ...exp,
              id: exp.id || Date.now().toString(),
            })) : [],
            projects: Array.isArray(data.projects) ? data.projects.map((project: any) => ({
              ...project,
              id: project.id || Date.now().toString(),
            })) : [],
          })
        } else if (response.status === 404) {
          console.log('No existing CV found')
        } else {
          throw new Error(`Failed to fetch CV: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Error fetching CV:', error)
      } finally {
        setCvLoading(false)
      }
    }

    fetchCV()
  }, [])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    if (cv) {
      let cvData = ''
      switch (option) {
        case 'skills':
          cvData = cv.skills.map(skillCategory =>
            `${skillCategory.category}:\n${skillCategory.items.map((item: any) => `• ${item}`).join('\n')}`
          ).join('\n\n')
          break
        case 'experience':
          cvData = cv.experience.map(exp =>
            `${exp.title} at ${exp.company} (${exp.location})\n${exp.responsibilities.map((resp: any) => `• ${resp}`).join('\n')}`
          ).join('\n\n')
          break
        case 'education':
          cvData = cv.education.map(edu =>
            `${edu.degree} in ${edu.field}\n• Institution: ${edu.institution}\n• GPA: ${edu.gpa}`
          ).join('\n\n')
          break
      }
      setInput(`Please enhance the following ${option} section of my CV:\n\n${cvData}`)
    } else {
      setInput(`I want to enhance my ${option} in my CV.`)
    }
  }

  const handleFavorite = (message: string) => {
    toggleFavorite(message)
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredOptions = enhancementOptions.filter(option =>
    option.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBack = () => {
    setSelectedOption(null)
  }

  const handleDelete = (id: string) => {
    deleteMessage(id)
  }

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <>
      <ZoomableModal isOpen={isOpen} onClose={() => setIsOpen(false)} onBack={handleBack}>
        <Card className="border-none shadow-none h-full flex flex-col">
          <CardHeader className="relative pb-2 flex-shrink-0">
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarFallback className="bg-gradient-to-br from-orange-50 via-white to-amber-50">
                  <Sparkles className="h-8 w-8 text-orange-600" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold text-center">CV Enhancer</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {selectedOption ? `Enhancing your ${selectedOption}` : 'Select what you want to enhance in your CV'}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pb-4 flex-grow overflow-auto">
            {cvLoading ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader size={24} color="#f97316" />
              </div>
            ) : (
              !selectedOption ? (
                <div className="h-full flex flex-col">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search enhancement options..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex-grow overflow-auto">
                    {filteredOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant="ghost"
                        className="w-full justify-between hover:bg-orange-50"
                        onClick={() => handleOptionSelect(option.id)}
                      >
                        {option.title}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFavorites}
                      className="flex items-center"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
                    </Button>
                  </div>
                  <div
                    ref={chatContainerRef}
                    className="flex-grow overflow-auto border rounded-md p-4 space-y-4 mb-4"
                  >
                    {(showFavorites ? storedMessages.filter(msg => favorites.includes(msg.content)) : messages).map((message: Message) => (
                      <div
                        key={message.id}
                        className={`p-2 rounded-lg ${
                          message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                        } max-w-[80%] relative group`}
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {format(message.timestamp || Date.now(), 'MMM d, h:mm a')}
                        </div>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className="prose prose-sm max-w-none"
                        >
                          {message.content}
                        </ReactMarkdown>
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleFavorite(message.content)}
                            className="text-yellow-500 hover:text-yellow-600"
                          >
                            {favorites.includes(message.content) ? '★' : '☆'}
                          </button>
                          <button
                            onClick={() => handleCopy(message.content, message.id)}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {copiedId === message.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-center">
                        <ClipLoader size={24} color="#f97316" />
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="flex-shrink-0 relative mb-4 ">
                    <TextareaAutosize
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as any);
                        }
                      }}
                      placeholder={`Enter your ${selectedOption} details...`}
                      className="w-full rounded-lg sticky border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12 resize-none overflow-y-auto min-h-[120px]"
                      disabled={isLoading || loading}
                      minRows={4}
                      maxRows={8}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || loading}
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full p-0 hover:bg-accent"
                      size="icon"
                    >
                      {isLoading ?
                        <ClipLoader size={14} color="#ffffff" /> :
                        <Send className="h-4 w-4" />
                      }
                    </Button>
                  </form>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </ZoomableModal>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 md:right-8"
      >
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-50 via-white to-amber-50 hover:from-orange-100 hover:to-amber-100"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6 text-orange-600" />
        </Button>
      </motion.div>
    </>
  )
}

