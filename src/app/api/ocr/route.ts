import { NextRequest } from 'next/server'
import vision from '@google-cloud/vision'
import { parseReport } from '@/lib/parse'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as unknown as File | null
    if (!file) {
      return Response.json({ ok: false, error: 'Arquivo não enviado' }, { status: 400 })
    }

    // Converte o arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Cria cliente Vision com credenciais do .env
    const client = new vision.ImageAnnotatorClient()

    // Executa OCR
    const [result] = await client.textDetection({ image: { content: buffer } })
    const text = result?.fullTextAnnotation?.text || ''

    // Faz parsing das métricas
    const parsed = parseReport(text)

    return Response.json({
      ok: true,
      data: parsed,
      raw: text.slice(0, 1000), // parte do texto cru para debug
    })
  } catch (err: any) {
    console.error('Erro no OCR:', err)
    return Response.json({ ok: false, error: err.message || 'Falha no OCR' }, { status: 500 })
  }
}
