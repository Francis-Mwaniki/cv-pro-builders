import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from 'lucide-react'

interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  responsibilities: string[]
}

interface ExperienceFormProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
}

export default function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const handleAdd = () => {
    onChange([...data, { title: "", company: "", location: "", startDate: "", endDate: "", responsibilities: [""] }])
  }

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Experience, value: string | string[]) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  const handleAddResponsibility = (index: number) => {
    const newData = [...data]
    newData[index].responsibilities.push("")
    onChange(newData)
  }

  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    const newData = [...data]
    newData[expIndex].responsibilities = newData[expIndex].responsibilities.filter((_, i) => i !== respIndex)
    onChange(newData)
  }

  const handleChangeResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const newData = [...data]
    newData[expIndex].responsibilities[respIndex] = value
    onChange(newData)
  }

  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <div key={index} className="p-4 border rounded-md relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemove(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`title-${index}`}>Job Title</Label>
              <Input
                id={`title-${index}`}
                value={exp.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor={`company-${index}`}>Company</Label>
              <Input
                id={`company-${index}`}
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <Label htmlFor={`location-${index}`}>Location</Label>
              <Input
                id={`location-${index}`}
                value={exp.location}
                onChange={(e) => handleChange(index, "location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Responsibilities</Label>
              {exp.responsibilities.map((resp, respIndex) => (
                <div key={respIndex} className="flex mt-2">
                  <Textarea
                    value={resp}
                    onChange={(e) => handleChangeResponsibility(index, respIndex, e.target.value)}
                    placeholder="Describe your responsibility"
                    className="mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResponsibility(index, respIndex)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddResponsibility(index)} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Responsibility
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={handleAdd} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  )
}