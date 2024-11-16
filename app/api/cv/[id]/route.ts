import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id
    const cv = await prisma.cV.findUnique({
      where: { id },
      include: {
        education: true,
        skills: true,
        experience: true,
        projects: true,
      },
    })

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    return NextResponse.json(cv)
  } catch (error) {
    console.error('Error fetching CV:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}