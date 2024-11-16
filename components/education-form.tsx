import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from 'lucide-react'

interface Education {
  institution: string
  degree: string
  field: string
  gpa: string
  startDate: string
  endDate: string
}

interface EducationFormProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const handleAdd = () => {
    onChange([...data, { institution: "", degree: "", field: "", gpa: "", startDate: "", endDate: "" }])
  }

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
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
              <Label htmlFor={`institution-${index}`}>Institution</Label>
              <Input
                id={`institution-${index}`}
                value={edu.institution}
                onChange={(e) => handleChange(index, "institution", e.target.value)}
                placeholder="University of Example"
              />
            </div>
            <div>
              <Label htmlFor={`degree-${index}`}>Degree</Label>
              <Input
                id={`degree-${index}`}
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <Label htmlFor={`field-${index}`}>Field of Study</Label>
              <Input
                id={`field-${index}`}
                value={edu.field}
                onChange={(e) => handleChange(index, "field", e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div>
              <Label htmlFor={`gpa-${index}`}>GPA</Label>
              <Input
                id={`gpa-${index}`}
                value={edu.gpa}
                onChange={(e) => handleChange(index, "gpa", e.target.value)}
                placeholder="3.8"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={handleAdd} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  )
}