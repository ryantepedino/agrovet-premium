import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  try {
    const reports = await prisma.report.findMany();
    console.log("✅ Relatórios encontrados:", reports);
  } catch (err) {
    console.error("❌ Erro ao consultar o banco:", err);
  } finally {
    await prisma.$disconnect();
  }
};

main();
