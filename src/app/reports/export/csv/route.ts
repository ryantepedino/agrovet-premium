import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (!reports.length) {
      return new NextResponse('Nenhum relatório encontrado.', { status: 404 })
    }

    // Cabeçalho do CSV
    const headers = [
      'ID',
      'Fazenda',
      'Mês de Referência',
      'Veterinário',
      'Observações',
      'Taxa de Prenhez (%)',
      'Taxa de Concepção (%)',
      'Taxa de Serviço (%)',
      'Partos Previstos',
      'Inseminações',
      'Diagnósticos Positivos',
      'Matrizes Expostas',
      'Criado em',
    ]

    // Linhas dos relatórios
    const rows = reports.map((r) => [
      r.id,
      r.fazenda ?? '',
      r.mesReferencia ?? '',
      r.veterinario ?? '',
      (r.observacoes ?? '').replace(/[\r\n]+/g, ' '),
      r.taxaPrenhez ?? '',
      r.taxaConcepcao ?? '',
      r.taxaServico ?? '',
      r.partosPrevistos ?? '',
      r.inseminacoes ?? '',
      r.diagnosticosPos ?? '',
      r.matrizesExpostas ?? '',
      new Date(r.createdAt).toLocaleString('pt-BR'),
    ])

    // Monta CSV em memória
    const csv = [headers, ...rows].map((line) => line.join(';')).join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="relatorios-agrovet.csv"',
      },
    })
  } catch (err: any) {
    console.error('❌ Erro ao gerar CSV:', err)
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 })
  }
}
