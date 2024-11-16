import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from 'lucide-react'

interface Skill {
  category: string
  items: string[]
}

interface SkillsFormProps {
  data: Skill[]
  onChange: (data: Skill[]) => void
}

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("")

  const handleAddCategory = () => {
    onChange([...data, { category: "", items: [] }])
  }

  const handleRemoveCategory = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const handleChangeCategory = (index: number, value: string) => {
    const newData = [...data]
    newData[index].category = value
    onChange(newData)
  }

  const handleAddSkill = (categoryIndex: number) => {
    if (newSkill.trim() === "") return
    const newData = [...data]
    newData[categoryIndex].items.push(newSkill.trim())
    onChange(newData)
    setNewSkill("")
  }

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const newData = [...data]
    newData[categoryIndex].items = newData[categoryIndex].items.filter((_, i) => i !== skillIndex)
    onChange(newData)
  }

  return (
    <div className="space-y-4">
      {data.map((category, categoryIndex) => (
        <div key={categoryIndex} className="p-4 border rounded-md relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemoveCategory(categoryIndex)}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`category-${categoryIndex}`}>Category</Label>
              <Input
                id={`category-${categoryIndex}`}
                value={category.category}
                onChange={(e) => handleChangeCategory(categoryIndex, e.target.value)}
                placeholder="Programming Languages"
              />
            </div>
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {category.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1">
                    <span>{skill}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-4 w-4"
                      onClick={() => handleRemoveSkill(categoryIndex, skillIndex)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="mr-2"
                />
                <Button onClick={() => handleAddSkill(categoryIndex)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={handleAddCategory} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Skill Category
      </Button>
    </div>
  )
}