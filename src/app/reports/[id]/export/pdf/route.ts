import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'

// Tenta carregar a fonte Unicode local; se falhar, usa Helvetica e sanitiza texto
async function loadUnicodeFont(pdfDoc: PDFDocument) {
  const fontPath = path.resolve(process.cwd(), 'src/fonts/DejaVuSans.ttf')
  try {
    const bytes = fs.readFileSync(fontPath)
    return await pdfDoc.embedFont(bytes, { subset: true })
  } catch {
    return await pdfDoc.embedFont(StandardFonts.Helvetica) // fallback
  }
}

// Remove caracteres fora do WinAnsi (quando fallback usar Helvetica)
function sanitize(text: string) {
  // Remove emojis e chars fora do BMP básico
  return text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
}

export async function GET(
  _req: NextRequest,
  contextPromise: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await contextPromise.params
    const reportId = Number(id)
    if (!Number.isFinite(reportId)) {
      return new Response('ID inválido', { status: 400 })
    }

    const report = await prisma.report.findFirst({ where: { id: reportId } })
    if (!report) {
      return new Response('Relatório não encontrado', { status: 404 })
    }

    // Cria PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4
    const font = await loadUnicodeFont(pdfDoc)
    const { width, height } = page.getSize()
    const margin = 40
    let y = height - margin

    const drawText = (rawText: any, size = 12, color = rgb(0, 0, 0)) => {
      const text = typeof rawText === 'string' ? rawText : String(rawText ?? '—')
      const safe = font.name === 'Helvetica' ? sanitize(text) : text
      page.drawText(safe, { x: margin, y, size, font, color })
      y -= size + 6
    }

    const V = (v: any, s = '') => (v ?? '—') + s

    // Cabeçalho (sem depender de emoji)
    drawText('AgroVet Premium', 20, rgb(0, 0.2, 0.5))
    y -= 10

    // Informações básicas
    drawText(`Fazenda: ${V(report.fazenda)}`)
    drawText(`Mês de Referência: ${V(report.mesReferencia)}`)
    drawText(`Veterinário: ${V(report.veterinario)}`)
    y -= 10

    // Indicadores
    drawText('Indicadores Reprodutivos', 14, rgb(0.1, 0.1, 0.4))
    drawText(`Taxa de Prenhez: ${V(report.taxaPrenhez, '%')}`)
    drawText(`Taxa de Concepção: ${V(report.taxaConcepcao, '%')}`)
    drawText(`Taxa de Serviço: ${V(report.taxaServico, '%')}`)
    drawText(`N° de Partos Previstos: ${V(report.partosPrevistos)}`)
    drawText(`N° de Inseminações: ${V(report.inseminacoes)}`)
    drawText(`N° de Diagnósticos Positivos: ${V(report.diagnosticosPos)}`)
    drawText(`N° de Matrizes Expostas: ${V(report.matrizesExpostas)}`)
    y -= 10

    // Observações
    drawText('Observações', 14, rgb(0.1, 0.1, 0.4))
    drawText(report.observacoes ?? 'Nenhuma observação registrada.')
    y -= 20

    // Rodapé
    drawText(
      `Gerado automaticamente por AgroVet Premium © ${new Date().getFullYear()}`,
      10,
      rgb(0.4, 0.4, 0.4)
    )

    const pdfBytes = await pdfDoc.save()

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="relatorio-${report.id}.pdf"`,
      },
    })
  } catch (err: any) {
    console.error('❌ Erro ao gerar PDF:', err)
    return new Response(`Erro ao gerar PDF: ${err?.message || String(err)}`, { status: 500 })
  }
}
