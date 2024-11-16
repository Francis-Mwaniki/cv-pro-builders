"use client"

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation"
import { ClipLoader } from "react-spinners"
import { Share2, Linkedin, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

interface CV {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    linkedin: string
    github: string
  }
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    gpa: string
    startDate: string
    endDate: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string[]
  }>
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    responsibilities: string[]
  }>
  projects: Array<{
    id: string
    title: string
    link: string
    startDate: string
    endDate: string
    description: string[]
  }>
}
type Props = {
  params: Promise<{
      id: string;
  }>
}
export default function CVPage(props: Props) {
  const params = use(props.params);
  const { id } = params;
  const [cv, setCV] = useState<CV | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(`/api/cv/${id}`)
        if (!response.ok) {
          throw new Error("CV not found")
        }
        const data = await response.json()
        
        // Sort experience by date in descending order
        const sortedExperience = [...data.experience].sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
        
        setCV({
          ...data,
          experience: sortedExperience
        })
      } catch {
        toast({
          title: "Error",
          description: "Failed to load CV. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCV()
    }
  }, [id, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Success",
        description: "CV link copied to clipboard!",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <ClipLoader size={50} color="#f59e0b" />
      </div>
    )
  }

  if (!cv) {
    return null
  }

  return (
    <div className={`min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 md:p-12 ${quicksand.className}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-orange-600 mb-2">{cv.personalInfo.fullName}</h1>
            <div className="space-y-1 text-gray-600">
              <p>{cv.personalInfo.email}</p>
              <p>{cv.personalInfo.phone}</p>
              {cv.personalInfo.linkedin &&
                <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="text-orange-500 hover:text-orange-600 flex items-center">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn Profile
                </a>
              }
              {cv.personalInfo.github &&
                <a href={cv.personalInfo.github} target="_blank" rel="noopener noreferrer"
                   className="text-orange-500 hover:text-orange-600 flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Profile
                </a>
              }
            </div>
          </div>
          <Button onClick={handleShare} variant="outline" className="border-orange-200 hover:bg-orange-50">
            <Share2 className="mr-2 h-4 w-4" />
            
          </Button>
        </div>

        {cv.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 border-b border-orange-200 pb-2 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {cv.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-lg">{edu.institution}</h3>
                  <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                  <p className="text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 border-b border-orange-200 pb-2 mb-4">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cv.skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="font-semibold">{skill.category}</h3>
                  <p className="text-gray-700">{skill.items.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 border-b border-orange-200 pb-2 mb-4">
              Experience
            </h2>
            <div className="space-y-6">
              {cv.experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <p className="text-gray-700">{exp.company}, {exp.location}</p>
                  <p className="text-gray-600 mb-2">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </p>
                  <ul className="list-disc list-inside space-y-1"> 
                    {exp.responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-700">{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 border-b border-orange-200 pb-2 mb-4">
              Projects
            </h2>
            <div className="space-y-6">
              {cv.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      Project Link
                    </a>
                  )}
                  <p className="text-gray-600 mb-2">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {project.description.map((desc, index) => (
                      <li key={index} className="text-gray-700">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
