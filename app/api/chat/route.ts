import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

const model = google('gemini-1.5-pro-latest')

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: Request): Promise<Response> {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  let prompt = `You are an AI assistant specialized in improving CV content. Your responses should be structured, precise, and professional. Use Markdown formatting to enhance readability.

Guidelines:
- Provide direct, actionable advice
- Use professional language
- Keep suggestions concise and impactful
- Structure your response with clear headings and bullet points
- Use Markdown formatting for emphasis and organization

Original content:
${lastMessage.content}

Please provide your enhanced version and suggestions in the following format:

## Enhanced Content

[Provide the enhanced version here]

## Suggestions for Improvement

- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]

## Key Points to Remember

- [Key point 1]
- [Key point 2]
- [Key point 3]

`

  if (lastMessage.content.toLowerCase().includes('skills')) {
    prompt += `Focus on making the skills more impactful and relevant. Suggest improvements or additions based on current industry trends.`
  } else if (lastMessage.content.toLowerCase().includes('experience')) {
    prompt += `Focus on highlighting achievements, using strong action verbs, and quantifying results where possible.`
  } else if (lastMessage.content.toLowerCase().includes('education')) {
    prompt += `Focus on highlighting relevant coursework, academic achievements, and any projects or research that might be relevant to the job seeker's target role.`
  } else {
    prompt += `Provide general advice on improving CV content. Focus on best practices, common mistakes to avoid, and tips for making the CV stand out.`
  }

  const result = streamText({
    model: model,
    prompt: prompt,
  })

  return result.toDataStreamResponse()
}

