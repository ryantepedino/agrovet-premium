-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "fazenda" TEXT,
    "mesReferencia" TEXT,
    "veterinario" TEXT,
    "observacoes" TEXT,
    "taxaPrenhez" INTEGER,
    "taxaConcepcao" INTEGER,
    "taxaServico" INTEGER,
    "partosPrevistos" INTEGER,
    "inseminacoes" INTEGER,
    "diagnosticosPos" INTEGER,
    "matrizesExpostas" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
