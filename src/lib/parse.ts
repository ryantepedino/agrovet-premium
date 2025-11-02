export function parseReport(text: string) {
  // Parser simples para evitar erros de build
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  return {
    fazenda: lines.find(l => l.toLowerCase().includes('fazenda')) || 'Desconhecida',
    mesReferencia: lines.find(l => l.toLowerCase().includes('mês')) || 'N/A',
    taxaPrenhez: 0,
    taxaConcepcao: 0,
    taxaServico: 0,
    partosPrevistos: 0,
    inseminacoes: 0,
    diagnosticosPos: 0,
    matrizesExpostas: 0
  }
}
