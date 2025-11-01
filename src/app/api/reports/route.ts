import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// 🔹 Cria um novo relatório (usado pela IA de OCR)
export async function POST(req: Request) {
  const body = await req.json()
  const r = await prisma.report.create({ data: normalize(body) })
  return Response.json({ ok: true, data: r })
}

// 🔹 Lista todos os relatórios (usado pelo Dashboard e CSV)
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(reports)
  } catch (err: any) {
    console.error('Erro ao listar relatórios:', err)
    return Response.json({ ok: false, error: err.message || String(err) }, { status: 500 })
  }
}

// 🔹 Normaliza dados numéricos antes de salvar
function normalize(d: any) {
  const num = (x: any) =>
    x === null || x === undefined || x === '' ? null : Number(x)

  return {
    fazenda: d.fazenda || null,
    mesReferencia: d.mesReferencia || null,
    veterinario: d.veterinario || null,
    observacoes: d.observacoes || null,
    taxaPrenhez: num(d.taxaPrenhez),
    taxaConcepcao: num(d.taxaConcepcao),
    taxaServico: num(d.taxaServico),
    partosPrevistos: num(d.partosPrevistos),
    inseminacoes: num(d.inseminacoes),
    diagnosticosPos: num(d.diagnosticosPos),
    matrizesExpostas: num(d.matrizesExpostas),
  }
}
