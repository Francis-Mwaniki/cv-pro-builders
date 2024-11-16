/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user session", status: 401 },
        { status: 401 }
      );
    }

    const { personalInfo, education, skills, experience, projects } = await req.json();

    const existingCV = await prisma.cV.findUnique({
      where: {
        userId,
      },
    });

    if (existingCV) {
      const updatedCV = await prisma.cV.update({
        where: {
          id: existingCV.id,
        },
        data: {
          personalInfo: personalInfo,
          education: {
            deleteMany: {},
            createMany: {
              data: education.map((edu: any) => ({
                institution: edu.institution,
                degree: edu.degree,
                field: edu.field,
                gpa: edu.gpa,
                startDate: new Date(edu.startDate),
                endDate: edu.endDate ? new Date(edu.endDate) : null,
              })),
            },
          },
          skills: {
            deleteMany: {},
            createMany: {
              data: skills.map((skill: any) => ({
                category: skill.category,
                items: skill.items,
              })),
            },
          },
          experience: {
            deleteMany: {},
            createMany: {
              data: experience.map((exp: any) => ({
                title: exp.title,
                company: exp.company,
                location: exp.location,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                responsibilities: exp.responsibilities,
              })),
            },
          },
          projects: {
            deleteMany: {},
            createMany: {
              data: projects.map((project: any) => ({
                title: project.title,
                link: project.link,
                startDate: new Date(project.startDate),
                endDate: project.endDate ? new Date(project.endDate) : null,
                description: project.description,
              })),
            },
          },
        },
        include: {
          education: true,
          skills: true,
          experience: true,
          projects: true,
        },
      });

      return NextResponse.json(updatedCV);
    } else {
      const newCV = await prisma.cV.create({
        data: {
          personalInfo: personalInfo,
          education: {
            createMany: {
              data: education.map((edu: any) => ({
                institution: edu.institution,
                degree: edu.degree,
                field: edu.field,
                gpa: edu.gpa,
                startDate: new Date(edu.startDate),
                endDate: edu.endDate ? new Date(edu.endDate) : null,
              })),
            },
          },
          skills: {
            createMany: {
              data: skills.map((skill: any) => ({
                category: skill.category,
                items: skill.items,
              })),
            },
          },
          experience: {
            createMany: {
              data: experience.map((exp: any) => ({
                title: exp.title,
                company: exp.company,
                location: exp.location,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                responsibilities: exp.responsibilities,
              })),
            },
          },
          projects: {
            createMany: {
              data: projects.map((project: any) => ({
                title: project.title,
                link: project.link,
                startDate: new Date(project.startDate),
                endDate: project.endDate ? new Date(project.endDate) : null,
                description: project.description,
              })),
            },
          },
          userId,
        },
        include: {
          education: true,
          skills: true,
          experience: true,
          projects: true,
        },
      });

      return NextResponse.json(newCV);
    }
  } catch (error: any) {
    console.error("Error creating/updating CV:", error);
    return NextResponse.json(
      { message: "An error occurred while creating/updating the CV", status: 500 },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user session", status: 401 },
        { status: 401 }
      );
    }

    const cv = await prisma.cV.findUnique({
      where: {
        userId,
      },
      include: {
        
        education: true,
        skills: true,
        experience: true,
        projects: true,
      },
    });

    if (!cv) {
      return NextResponse.json(
        { message: "No CV found for the user", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(cv);
  } catch (error: any) {
    console.error("Error fetching CV:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the CV", status: 500 },
      { status: 500 }
    );
  }
}