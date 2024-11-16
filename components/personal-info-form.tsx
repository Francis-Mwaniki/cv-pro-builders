import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  linkedin: string
  github: string
}

interface PersonalInfoFormProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="+1 (123) 456-7890"
        />
      </div>
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          name="linkedin"
          value={data.linkedin}
          onChange={handleChange}
          placeholder="https://www.linkedin.com/in/johndoe"
        />
      </div>
      <div>
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          name="github"
          value={data.github}
          onChange={handleChange}
          placeholder="https://github.com/johndoe"
        />
      </div>
    </div>
  )
}