-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fazenda" TEXT,
    "mesReferencia" TEXT,
    "veterinario" TEXT,
    "observacoes" TEXT,
    "taxaPrenhez" REAL,
    "taxaConcepcao" REAL,
    "taxaServico" REAL,
    "partosPrevistos" INTEGER,
    "inseminacoes" INTEGER,
    "diagnosticosPos" INTEGER,
    "matrizesExpostas" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
