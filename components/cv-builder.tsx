/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ClipLoader } from "react-spinners"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Download, Eye, Linkedin, Github, Mail, Phone, Plus, Trash2,Share2 } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from "@/hooks/use-toast"
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

// Type definitions
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  gpa: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

interface Project {
  id: string;
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface Skill {
  id: string;
  category: string;
  items: string[];
}

interface CV {
  id: string;
  personalInfo: PersonalInfo;
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
}

const validatePersonalInfo = (personalInfo: PersonalInfo): boolean => {
  return Boolean(
    personalInfo.fullName &&
    personalInfo.email &&
    personalInfo.phone
  );
};

const validateCV = (cv: CV): boolean => {
  if (!validatePersonalInfo(cv.personalInfo)) {
    toast({
      title: "Validation Error",
      description: "Please fill in all required personal information fields.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

// Sub-components
const PersonalInfoForm = ({ data, onChange }: { data: PersonalInfo; onChange: (data: PersonalInfo) => void }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    linkedin: data.linkedin || '',
    github: data.github || '',
  })

  useEffect(() => {
    setPersonalInfo({
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      linkedin: data.linkedin || '',
      github: data.github || '',
    })
  }, [data])

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    const updatedInfo = { ...personalInfo, [field]: value }
    setPersonalInfo(updatedInfo)
    onChange(updatedInfo)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={personalInfo.phone}
          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={personalInfo.linkedin}
          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>
      <div>
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          value={personalInfo.github}
          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
          placeholder="https://github.com/johndoe"
        />
      </div>
    </div>
  )
}

const EducationForm = ({ data, onChange }: { data: Education[]; onChange: (data: Education[]) => void }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      gpa: '',
      startDate: '',
      endDate: '',
    }
    onChange([...data, newEducation])
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
        <div key={edu.id} className="space-y-2 p-4 border rounded-md">
          <Input
            value={edu.institution}
            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
            placeholder="Institution"
          />
          <Input
            value={edu.degree}
            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
            placeholder="Degree"
          />
          <Input
            value={edu.field}
            onChange={(e) => updateEducation(index, 'field', e.target.value)}
            placeholder="Field of Study"
          />
          <Input
            value={edu.gpa}
            onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
            placeholder="GPA"
          />
          <Input
            type="date"
            value={edu.startDate}
            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
          />
          <Input
            type="date"
            value={edu.endDate}
            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
          />
          <Button onClick={() => removeEducation(index)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={addEducation}>
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  )
}

const SkillsForm = ({ data, onChange }: { data: Skill[]; onChange: (data: Skill[]) => void }) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      category: '',
      items: [],
    }
    onChange([...data, newSkill])
  }

  const updateSkill = (index: number, field: keyof Skill, value: string | string[]) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {data.map((skill, index) => (
        <div key={skill.id} className="space-y-2 p-4 border rounded-md">
          <Input
            value={skill.category}
            onChange={(e) => updateSkill(index, 'category', e.target.value)}
            placeholder="Skill Category"
          />
          <Textarea
            value={skill.items.join(', ')}
            onChange={(e) => updateSkill(index, 'items', e.target.value.split(',').map(item => item.trim()))}
            placeholder="Skills (comma-separated)"
          />
          <Button onClick={() => removeSkill(index)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={addSkill}>
        <Plus className="mr-2 h-4 w-4" />
        Add Skill Category
      </Button>
    </div>
  )
}

const ExperienceForm = ({ data, onChange }: { data: Experience[]; onChange: (data: Experience[]) => void }) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: [],
    }
    onChange([...data, newExperience])
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <div key={exp.id} className="space-y-2 p-4 border rounded-md">
          <Input
            value={exp.title}
            onChange={(e) => updateExperience(index, 'title', e.target.value)}
            placeholder="Job Title"
          />
          <Input
            value={exp.company}
            onChange={(e) => updateExperience(index, 'company', e.target.value)}
            placeholder="Company"
          />
          <Input
            value={exp.location}
            onChange={(e) => updateExperience(index, 'location', e.target.value)}
            placeholder="Location"
          />
          <Input
            type="date"
            value={exp.startDate}
            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
          />
          <Input
            type="date"
            value={exp.endDate}
            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
          />
          <Textarea
            value={exp.responsibilities.join('\n')}
            onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n'))}
            placeholder="Responsibilities (one per line)"
          />
          <Button onClick={() => removeExperience(index)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={addExperience}>
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  )
}

const ProjectsForm = ({ data, onChange }: { data: Project[]; onChange: (data: Project[]) => void }) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      link: '',
      startDate: '',
      endDate: '',
      description: [],
    }
    onChange([...data, newProject])
  }

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {data.map((project, index) => (
        <div key={project.id} className="space-y-2 p-4 border rounded-md">
          <Input
            value={project.title}
            onChange={(e) => updateProject(index, 'title', e.target.value)}
            placeholder="Project Title"
          />
          <Input
            value={project.link}
            onChange={(e) => updateProject(index, 'link', e.target.value)}
            placeholder="Project Link (optional)"
          />
          <Input
            type="date"
            value={project.startDate}
            onChange={(e) => updateProject(index, 'startDate', e.target.value)}
          />
          <Input
            type="date"
            value={project.endDate}
            onChange={(e) => updateProject(index, 'endDate', e.target.value)}
          />
          <Textarea
            value={project.description.join('\n')}
            onChange={(e) => updateProject(index, 'description', e.target.value.split('\n'))}
            placeholder="Project Description (one point per line)"
          />
          <Button onClick={() => removeProject(index)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={addProject}>
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  )
}

export default function CVBuilder() {
  const [activeTab, setActiveTab] = useState("personal")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cv, setCV] = useState<CV>({
    id: '',
    personalInfo: { fullName: '', email: '', phone: '', linkedin: '', github: '' },
    education: [],
    skills: [],
    experience: [],
    projects: []
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cv')
        if (response.ok) {
          const data = await response.json()
          setCV(prevCV => ({
            ...prevCV,
            id:data.id,
            personalInfo: typeof data.personalInfo === 'string' ? JSON.parse(data.personalInfo) : data.personalInfo,
            education: data.education.map((edu: any) => ({
              ...edu,
              id: edu.id || Date.now().toString(),
            })),
            skills: data.skills.map((skill: any) => ({
              ...skill,
              id: skill.id || Date.now().toString(),
            })),
            experience: data.experience.map((exp: any) => ({
              ...exp,
              id: exp.id || Date.now().toString(),
            })),
            projects: data.projects.map((project: any) => ({
              ...project,
              id: project.id || Date.now().toString(),
            })),
          }))
        } else if (response.status === 404) {
          console.log('No existing CV found')
        } else {
          throw new Error(`Failed to fetch CV: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Error fetching CV:', error)
        toast({
          title: "Error",
          description: "Failed to load CV data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [])

  const handleSave = useCallback(async () => {
    try {
      if (!validateCV(cv)) {
        return;
      }

      setSaving(true)
      
      const sanitizedCV = {
        personalInfo: {
          fullName: cv.personalInfo.fullName.trim(),
          email: cv.personalInfo.email.trim(),
          phone: cv.personalInfo.phone.trim(),
          linkedin: cv.personalInfo.linkedin.trim(),
          github: cv.personalInfo.github.trim()
        },
        education: cv.education,
        skills: cv.skills,
        experience: cv.experience,
        projects: cv.projects
      };

      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedCV)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.details || responseData.message || `Server error: ${response.status}`);
      }

      setCV(prevCV => ({
        ...prevCV,
        id:responseData.id,
        personalInfo: responseData.personalInfo,
        education: responseData.education,
        skills: responseData.skills,
        experience: responseData.experience,
        projects: responseData.projects,
      }));
      
      toast({
        title: "Success",
        description: "Your CV has been successfully saved.",
      });
    } catch (error) {
      console.error('Failed to save CV:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to save CV: ${error.message}` 
          : "Failed to save CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [cv]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }
  const handleShare = async () => {
    try {
      const shareableLink = `${window.location.origin}/cv/${cv.id}`;
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Success",
        description: "CV link copied to clipboard!",
      });
    } catch (error) {
      console.error('Error sharing CV:', error);
      toast({
        title: "Error",
        description: "Failed to copy CV link. Please try again.",
        variant: "destructive",
      });
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Set Quicksand font
    doc.setFont(quicksand.style.fontFamily)
    
    // Header
    doc.setFontSize(24)
    doc.setFont(quicksand.style.fontFamily, "bold")
    doc.text(cv.personalInfo.fullName, 20, 20)
    
    // Contact Info
    doc.setFontSize(10)
    doc.setFont(quicksand.style.fontFamily, "normal")
    doc.text(`Email: ${cv.personalInfo.email}`, 20, 30)
    doc.text(`Mobile: ${cv.personalInfo.phone}`, 120, 30)
    doc.text(`LinkedIn: ${cv.personalInfo.linkedin}`, 20, 35)
    doc.text(`GitHub: ${cv.personalInfo.github}`, 120, 35)
    
    let yPos = 45
    
    // Education
    doc.setFontSize(14)
    doc.setFont(quicksand.style.fontFamily, "bold")
    doc.text("EDUCATION", 20, yPos)
    doc.line(20, yPos + 1, 190, yPos + 1)
    
    yPos += 10
    cv.education.forEach(edu => {
      doc.setFont(quicksand.style.fontFamily, "bold")
      doc.setFontSize(12)
      doc.text(edu.institution, 20, yPos)
      doc.text(`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 150, yPos, { align: 'right' })
      
      doc.setFont(quicksand.style.fontFamily, "normal")
      doc.setFontSize(11)
      doc.text(`${edu.degree} in ${edu.field}`, 20, yPos + 5)
      if (edu.gpa) {
        doc.text(`GPA: ${edu.gpa}`, 150, yPos + 5, { align: 'right' })
      }
      
      yPos += 15
    })
    
    // Skills
    yPos += 5
    doc.setFontSize(14)
    doc.setFont(quicksand.style.fontFamily, "bold")
    doc.text("SKILLS SUMMARY", 20, yPos)
    doc.line(20, yPos + 1, 190, yPos + 1)
    
    yPos += 10
    cv.skills.forEach(skill => {
      doc.setFontSize(11)
      doc.setFont(quicksand.style.fontFamily, "bold")
      doc.text(`${skill.category}:`, 20, yPos)
      doc.setFont(quicksand.style.fontFamily, "normal")
      const skillText = skill.items.join(', ')
      const splitSkills = doc.splitTextToSize(skillText, 160)
      doc.text(splitSkills, 50, yPos)
      yPos += 10 * splitSkills.length
    })
    
    // Experience
    yPos += 5
    doc.setFontSize(14)
    doc.setFont(quicksand.style.fontFamily, "bold")
    doc.text("WORK EXPERIENCE", 20, yPos)
    doc.line(20, yPos + 1, 190, yPos + 1)
    
    yPos += 10
    cv.experience.forEach(exp => {
      doc.setFontSize(12)
      doc.setFont(quicksand.style.fontFamily, "bold")
      doc.text(exp.title, 20, yPos)
      doc.text(`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`, 150, yPos, { align: 'right' })
      
      doc.setFontSize(11)
      doc.setFont(quicksand.style.fontFamily, "normal")
      doc.text(`${exp.company}, ${exp.location}`, 20, yPos + 5)
      
      yPos += 10
      exp.responsibilities.forEach(resp => {
        const bulletPoint = "• "
        const wrappedText = doc.splitTextToSize(resp, 160)
        doc.text(bulletPoint + wrappedText[0], 25, yPos)
        if (wrappedText.length > 1) {
            wrappedText.slice(1).forEach((line: string) => {
            yPos += 5
            doc.text(line, 27, yPos)
            })
        }
        yPos += 5
      })
      yPos += 5
    })
    
    // Projects
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(14)
    doc.setFont(quicksand.style.fontFamily, "bold")
    doc.text("PROJECTS", 20, yPos)
    doc.line(20, yPos + 1, 190, yPos + 1)
    
    yPos += 10
    cv.projects.forEach(project => {
      doc.setFontSize(12)
      doc.setFont(quicksand.style.fontFamily, "bold")
      doc.text(project.title, 20, yPos)
      doc.text(`${formatDate(project.startDate)} - ${formatDate(project.endDate)}`, 150, yPos, { align: 'right' })
      
      if (project.link) {
        yPos += 5
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 255)
        doc.textWithLink("Project Link", 20, yPos, { url: project.link })
        doc.setTextColor(0, 0, 0)
      }
      
      yPos += 5
      doc.setFontSize(11)
      doc.setFont(quicksand.style.fontFamily, "normal")
      project.description.forEach(desc => {
        const bulletPoint = "• "
        const wrappedText = doc.splitTextToSize(desc, 160)
        doc.text(bulletPoint + wrappedText[0], 25, yPos)
        if (wrappedText.length > 1) {
            wrappedText.slice(1).forEach((line: string) => {
            yPos += 5
            doc.text(line, 27, yPos)
            })
        }
        yPos += 5
      })
      yPos += 5
    })
    
    doc.save("cv.pdf")
  }

  if(loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <ClipLoader size={50} color="#f59e0b" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 md:p-8 ${quicksand.className}`}>
      <Card className="w-full max-w-4xl mx-auto border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl md:text-4xl text-center bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-bold">
            Build Your Professional CV
          </CardTitle>
          <p className="text-center text-muted-foreground">Create a standout CV in minutes</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 gap-1 md:gap-2 p-1 mb-8 bg-muted/20">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-md text-sm md:text-base"
              >
                Personal
              </TabsTrigger>
              <TabsTrigger 
                value="education"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-md text-sm md:text-base"
              >
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="skills"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-md text-sm md:text-base"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="experience"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-md text-sm md:text-base"
              >
                Experience
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-md text-sm md:text-base"
              >
                Projects
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-white rounded-lg p-4 shadow-sm"
            >
              <TabsContent value="personal">
                <PersonalInfoForm 
                  data={cv.personalInfo} 
                  onChange={(data) => setCV(prev => ({...prev, personalInfo: data}))} 
                />
              </TabsContent>

              <TabsContent value="education">
                <EducationForm 
                  data={cv.education} 
                  onChange={(data) => setCV(prev => ({...prev, education: data}))} 
                />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsForm 
                  data={cv.skills} 
                  onChange={(data) => setCV(prev => ({...prev, skills: data}))} 
                />
              </TabsContent>

              <TabsContent value="experience">
                <ExperienceForm 
                  data={cv.experience} 
                  onChange={(data) => setCV(prev => ({...prev, experience: data}))} 
                />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsForm 
                  data={cv.projects} 
                  onChange={(data) => setCV(prev => ({...prev, projects: data}))} 
                />
              </TabsContent>
            </motion.div>
          </Tabs>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
            >
              {saving ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save CV
                </>
              )}
            </Button>
            <Button 
              onClick={() => setShowPreview(!showPreview)} 
              variant="outline"
              className="w-full border-2 border-orange-200 hover:bg-orange-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button 
              onClick={generatePDF} 
              variant="outline"
              className="w-full border-2 border-amber-200 hover:bg-amber-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button 
              onClick={handleShare} 
              variant="outline"
              className="w-full border-2 border-blue-200 hover:bg-blue-50"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share CV
            </Button>
          </div>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-white rounded-lg p-6 shadow-lg"
            >
              <CVPreview cv={cv} />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })
}
function CVPreview({cv}: {cv: CV}) {
  const sortByEndDate = (a: { endDate: string }, b: { endDate: string }) => 
    new Date(b.endDate).getTime() - new Date(a.endDate).getTime()

  const sortedExperience = [...cv.experience].sort(sortByEndDate)
  const sortedProjects = [...cv.projects].sort(sortByEndDate)
  const sortedEducation = [...cv.education].sort(sortByEndDate)
  return (
    <div className="space-y-6 text-sm">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-orange-600">{cv.personalInfo.fullName}</h2>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        <a href={`mailto:${cv.personalInfo.email}`} className="text-orange-500 hover:text-orange-600 flex items-center">
          <Mail size={16} className="mr-1" /> {cv.personalInfo.email}
        </a>
        <a href={`tel:${cv.personalInfo.phone}`} className="text-orange-500 hover:text-orange-600 flex items-center">
          <Phone size={16} className="mr-1" /> {cv.personalInfo.phone}
        </a>
        {cv.personalInfo.linkedin && (
          <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 flex items-center">
            <Linkedin size={16} className="mr-1" /> LinkedIn
          </a>
        )}
        {cv.personalInfo.github && (
          <a href={cv.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 flex items-center">
            <Github size={16} className="mr-1" /> GitHub
          </a>
        )}
      </div>
    </div>

    {sortedExperience.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-1 mb-2">Experience</h3>
        {sortedExperience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">{exp.title}</p>
              <p className="text-xs text-gray-600">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
            </div>
            <p className="text-sm text-gray-700">{exp.company}, {exp.location}</p>
            <ul className="list-disc list-inside mt-1 text-xs">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {cv.skills.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-1 mb-2">Skills</h3>
        {cv.skills.map((skill) => (
          <div key={skill.id} className="mb-2">
            <p className="font-medium">{skill.category}</p>
            <p className="text-xs">{skill.items.join(', ')}</p>
          </div>
        ))}
      </div>
    )}

    {sortedProjects.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-1 mb-2">Projects</h3>
        {sortedProjects.map((project) => (
          <div key={project.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">{project.title}</p>
              <p className="text-xs text-gray-600">{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                Project Link
              </a>
            )}
            <ul className="list-disc list-inside mt-1 text-xs">
              {project.description.map((desc, idx) => (
                <li key={idx}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {sortedEducation.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-1 mb-2">Education</h3>
        {sortedEducation.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">{edu.institution}</p>
              <p className="text-xs text-gray-600">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
            <p className="text-sm">{edu.degree} in {edu.field}</p>
          </div>
        ))}
      </div>
    )}
  </div>
  )
}