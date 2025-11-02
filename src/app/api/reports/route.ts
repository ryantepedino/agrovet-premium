export const runtime = 'edge'

// ✅ API compatível com dashboard da Vercel
export async function GET() {
  const reports = [
    {
      id: 1,
      fazenda: "Fazenda São João",
      mesReferencia: "Out/2025",
      veterinario: "Dr. Jean Carvalho",
      taxaPrenhez: 79,
      taxaConcepcao: 80,
      taxaServico: 79,
      partosPrevistos: 12,
      inseminacoes: 50,
      diagnosticosPos: 40,
      matrizesExpostas: 62,
      createdAt: new Date().toISOString()
    }
  ]

  return new Response(JSON.stringify(reports), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
}
