'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B']

interface Report {
  id: number
  fazenda: string | null
  mesReferencia: string | null
  veterinario: string | null
  taxaPrenhez: number | null
  taxaConcepcao: number | null
  taxaServico: number | null
  partosPrevistos: number | null
  inseminacoes: number | null
  diagnosticosPos: number | null
  matrizesExpostas: number | null
  createdAt: string
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // 🔹 Busca relatórios do banco
  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        setReports(data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="p-10 text-center text-gray-600">
        <h1 className="text-2xl font-bold">Carregando dados...</h1>
      </main>
    )
  }

  if (!reports.length) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">
          📊 Dashboard Reprodutivo
        </h1>
        <p className="text-gray-500 mt-4">Nenhum relatório encontrado.</p>
      </main>
    )
  }

  // 🔹 Função de média segura
  const avg = (arr: (number | null)[]) => {
    const valid = arr.filter((v): v is number => v !== null)
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0
  }

  const taxaPrenhezMedia = avg(reports.map((r) => r.taxaPrenhez))
  const taxaConcepcaoMedia = avg(reports.map((r) => r.taxaConcepcao))
  const taxaServicoMedia = avg(reports.map((r) => r.taxaServico))

  const dataBar = [
    { name: 'Prenhez', value: taxaPrenhezMedia },
    { name: 'Concepção', value: taxaConcepcaoMedia },
    { name: 'Serviço', value: taxaServicoMedia },
  ]

  const dataPie = [
    {
      name: 'Partos',
      value: reports.reduce((s, r) => s + (r.partosPrevistos ?? 0), 0),
    },
    {
      name: 'Inseminações',
      value: reports.reduce((s, r) => s + (r.inseminacoes ?? 0), 0),
    },
    {
      name: 'Matrizes',
      value: reports.reduce((s, r) => s + (r.matrizesExpostas ?? 0), 0),
    },
  ]

  // 🔹 Último relatório (para exportação individual)
  const ultimoId = reports[0]?.id ?? 1

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        Dashboard Reprodutivo 🐄
      </h1>

      {/* 🔹 KPIs principais */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500">Taxa de Prenhez</h2>
          <p className="text-3xl font-bold text-blue-600">
            {taxaPrenhezMedia.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500">Taxa de Concepção</h2>
          <p className="text-3xl font-bold text-green-600">
            {taxaConcepcaoMedia.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500">Taxa de Serviço</h2>
          <p className="text-3xl font-bold text-yellow-600">
            {taxaServicoMedia.toFixed(1)}%
          </p>
        </div>
      </section>

      {/* 🔹 Gráfico de barras */}
      <section className="bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Médias das Taxas
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataBar}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {dataBar.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 🔹 Gráfico de pizza */}
      <section className="bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Distribuição de Eventos
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={dataPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {dataPie.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 🔹 Botões de Exportação */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={`/reports/${ultimoId}/export/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
        >
          📄 Baixar PDF do Relatório #{ultimoId}
        </a>

        <a
          href={`/reports/export/csv`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
        >
          📊 Exportar Todos (CSV)
        </a>
      </div>
    </main>
  )
}
