'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Report {
  id: number
  fazenda: string | null
  mesReferencia: string | null
  veterinario: string | null
  taxaPrenhez: number | null
  taxaConcepcao: number | null
  taxaServico: number | null
  createdAt: string
}

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => setReports(data ?? []))
      .catch(() => setReports([]))
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        AgroVet Premium 🐄
      </h1>

      {/* 🔹 Botões principais */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link
          href="/dashboard"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          📊 Ver Dashboard
        </Link>

        <a
          href="/reports/export/csv"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          📤 Exportar CSV
        </a>

        {reports.length > 0 && (
          <a
            href={`/reports/${reports[0].id}/export/pdf`}
            className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition"
          >
            🧾 Gerar PDF
          </a>
        )}
      </div>

      {/* 🔹 Tabela de relatórios */}
      <section className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Últimos Relatórios
        </h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">Nenhum relatório encontrado.</p>
        ) : (
          <table className="min-w-full border text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Fazenda</th>
                <th className="p-2 text-left">Mês</th>
                <th className="p-2 text-left">Veterinário</th>
                <th className="p-2 text-left">Prenhez</th>
                <th className="p-2 text-left">Concepção</th>
                <th className="p-2 text-left">Serviço</th>
                <th className="p-2 text-left">PDF</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.fazenda ?? '—'}</td>
                  <td className="p-2">{r.mesReferencia ?? '—'}</td>
                  <td className="p-2">{r.veterinario ?? '—'}</td>
                  <td className="p-2">{r.taxaPrenhez ?? '—'}%</td>
                  <td className="p-2">{r.taxaConcepcao ?? '—'}%</td>
                  <td className="p-2">{r.taxaServico ?? '—'}%</td>
                  <td className="p-2">
                    {r.fazenda && (
                      <a
                        href={`/reports/${r.id}/export/pdf`}
                        className="text-indigo-600 hover:underline"
                      >
                        Abrir PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 🔹 Rodapé */}
      <footer className="text-center text-gray-500 mt-10 text-sm">
        © {new Date().getFullYear()} AgroVet Premium — Desenvolvido por Data Tech
      </footer>
    </main>
  )
}
