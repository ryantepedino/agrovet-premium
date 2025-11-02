import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

const prisma = new PrismaClient();

// 📄 Exportar CSV ou PDF
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  const reports = await prisma.report.findMany({ orderBy: { id: "desc" } });

  if (format === "csv") {
    const parser = new Parser({
      fields: [
        "id",
        "fazenda",
        "mesReferencia",
        "veterinario",
        "taxaPrenhez",
        "taxaConcepcao",
        "taxaServico",
        "partosPrevistos",
        "inseminacoes",
        "diagnosticosPos",
        "matrizesExpostas",
        "createdAt",
      ],
    });
    const csv = parser.parse(reports);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="relatorios.csv"',
      },
    });
  }

  if (format === "pdf") {
    const report = reports[0];
    const pdfStream = new Readable({
      read() {
        const doc = new PDFDocument();
        doc.text("Relatório AgroVet Premium", { align: "center" });
        doc.moveDown();
        Object.entries(report).forEach(([key, value]) => {
          doc.text(`${key}: ${value ?? "—"}`);
        });
        doc.end();

        doc.on("data", (chunk) => this.push(chunk));
        doc.on("end", () => this.push(null));
      },
    });

    return new NextResponse(pdfStream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="relatorio.pdf"',
      },
    });
  }

  return NextResponse.json({ error: "Formato inválido. Use ?format=csv ou ?format=pdf" });
}
