import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const cvData = await request.json()

    // Create a new CV entry with a unique ID
    const sharedCV = await prisma.cV.create({
      data: {
        user: {
          connect: { id: cvData.userId }
        },
        personalInfo: {
          create: cvData.personalInfo
        },
        education: {
          create: cvData.education
        },
        skills: {
          create: cvData.skills
        },
        experience: {
          create: cvData.experience
        },
        projects: {
          create: cvData.projects
        }
      }
    })

    return NextResponse.json({ id: sharedCV.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating shareable CV:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}