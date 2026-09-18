import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const enquiries = await prisma.enquiry.findMany();
  console.log("Found enquiries:");
  for (const enq of enquiries) {
    console.log(`- ${enq.id}: ${enq.companyName} (${enq.fullName}) [${enq.email}]`);
    if (
      enq.companyName.includes('Vardhan') ||
      enq.companyName.includes('Shringaar') ||
      enq.companyName.includes('Kapoor') ||
      enq.companyName.includes('KalaKriti') ||
      enq.companyName.includes('Urban Threads') ||
      enq.companyName.includes('Aura')
    ) {
      console.log(`  -> Deleting mock data...`);
      await prisma.enquiry.delete({ where: { id: enq.id } });
    }
  }
  console.log("Cleanup done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
