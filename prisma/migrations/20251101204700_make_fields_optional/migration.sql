/*
  Warnings:

  - You are about to alter the column `taxaConcepcao` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `taxaPrenhez` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `taxaServico` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("createdAt", "diagnosticosPos", "fazenda", "id", "inseminacoes", "matrizesExpostas", "mesReferencia", "observacoes", "partosPrevistos", "taxaConcepcao", "taxaPrenhez", "taxaServico", "veterinario") SELECT "createdAt", "diagnosticosPos", "fazenda", "id", "inseminacoes", "matrizesExpostas", "mesReferencia", "observacoes", "partosPrevistos", "taxaConcepcao", "taxaPrenhez", "taxaServico", "veterinario" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
