import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, contextPromise: { params: Promise<{ id: string }> }) {
  try {
    // ✅ Agora esperamos o Promise
    const { id } = await contextPromise.params
    const numId = Number(id)

    if (Number.isNaN(numId)) {
      return new Response(JSON.stringify({ ok: false, error: 'ID inválido', id }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const report = await prisma.report.findFirst({ where: { id: numId } })
    if (!report) {
      return new Response(JSON.stringify({ ok: false, error: 'Não encontrado', id }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, data: report }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Diag /reports/[id] GET error:', err)
    return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
