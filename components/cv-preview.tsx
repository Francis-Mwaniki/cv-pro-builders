import { Card, CardContent } from "@/components/ui/card"

interface CV {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    linkedin: string
    github: string
  }
  education: {
    institution: string
    degree: string
    field: string
    gpa: string
    startDate: string
    endDate: string
  }[]
  skills: {
    category: string
    items: string[]
  }[]
  experience: {
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    responsibilities: string[]
  }[]
  projects: {
    title: string
    link: string
    startDate: string
    endDate: string
    description: string[]
  }[]
}

interface CVPreviewProps {
  cv: CV
}

export default function CVPreview({ cv }: CVPreviewProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{cv.personalInfo.fullName}</h1>
            <p className="text-sm text-gray-500">{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
            <p className="text-sm text-gray-500">
              {cv.personalInfo.linkedin && <span className="mr-2">LinkedIn: {cv.personalInfo.linkedin}</span>}
              {cv.personalInfo.github && <span>GitHub: {cv.personalInfo.github}</span>}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-2">EDUCATION</h2>
            {cv.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <strong>{edu.institution}</strong>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <p>{edu.degree}, {edu.field}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-2">SKILLS</h2>
            {cv.skills.map((category, index) => (
              <div key={index} className="mb-2">
                <strong>{category.category}: </strong>
                <span>{category.items.join(', ')}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-2">WORK EXPERIENCE</h2>
            {cv.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <strong>{exp.title}</strong>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p>{exp.company}, {exp.location}</p>
                <ul className="list-disc list-inside mt-2">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-2">PROJECTS</h2>
            {cv.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <strong>{project.title}</strong>
                  <span>{project.startDate} - {project.endDate}</span>
                </div>
                {project.link && <p>Link: {project.link}</p>}
                <ul className="list-disc list-inside mt-2">
                  {project.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}