import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sparkles } from 'lucide-react'

interface AIEnhanceButtonProps {
  onEnhance: (text: string) => Promise<string>
  inputText: string
  onUpdate: (enhancedText: string) => void
}

export function AIEnhanceButton({ onEnhance, inputText, onUpdate }: AIEnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = async () => {
    setIsEnhancing(true)
    try {
      const enhancedText = await onEnhance(inputText)
      onUpdate(enhancedText)
    } catch (error) {
      console.error('Error enhancing text:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <Button
      onClick={handleEnhance}
      disabled={isEnhancing}
      size="sm"
      variant="outline"
      className="ml-2"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      {isEnhancing ? 'Enhancing...' : 'Enhance'}
    </Button>
  )
}

