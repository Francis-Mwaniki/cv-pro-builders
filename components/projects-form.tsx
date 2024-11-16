import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from 'lucide-react'

interface Project {
  title: string
  link: string
  startDate: string
  endDate: string
  description: string[]
}
interface ProjectsFormProps {

    data: {
  
      id?: string;
  
      title: string;
  
      link?: string;
  
      startDate: string;
  
      endDate: string;
  
      description: string[];
  
    }[]
  
    onChange: (data: {
  
      id?: string;
  
      title: string;
  
      link?: string;
  
      startDate: string;
  
      endDate: string;
  
      description: string[];
  
    }[]) => void
  
  }

// interface ProjectsFormProps {
//   data: Project[]
//   onChange: (data: Project[]) => void
// }

export default function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const handleAdd = () => {
    onChange([...data, { title: "", link: "", startDate: "", endDate: "", description: [""] }])
  }

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Project, value: string | string[]) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  const handleAddDescription = (index: number) => {
    const newData = [...data]
    newData[index].description.push("")
    onChange(newData)
  }

  const handleRemoveDescription = (projIndex: number, descIndex: number) => {
    const newData = [...data]
    newData[projIndex].description = newData[projIndex].description.filter((_, i) => i !== descIndex)
    onChange(newData)
  }

  const handleChangeDescription = (projIndex: number, descIndex: number, value: string) => {
    const newData = [...data]
    newData[projIndex].description[descIndex] = value
    onChange(newData)
  }

  return (
    <div className="space-y-4">
      {data.map((project, index) => (
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
              <Label htmlFor={`title-${index}`}>Project Title</Label>
              <Input
                id={`title-${index}`}
                value={project.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="E-commerce Platform"
              />
            </div>
            <div>
              <Label htmlFor={`link-${index}`}>Project Link</Label>
              <Input
                id={`link-${index}`}
                value={project.link}
                onChange={(e) => handleChange(index, "link", e.target.value)}
                placeholder="https://github.com/yourusername/project"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  type="date"
                  value={project.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  type="date"
                  value={project.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              {project.description.map((desc, descIndex) => (
                <div key={descIndex} className="flex mt-2">
                  <Textarea
                    value={desc}
                    onChange={(e) => handleChangeDescription(index, descIndex, e.target.value)}
                    placeholder="Describe your project"
                    className="mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDescription(index, descIndex)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddDescription(index)} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Description
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={handleAdd} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  )
}