import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.program.updateMany({ data: { isPublished: true } })
  await prisma.activity.updateMany({ data: { isPublished: true } })
  await prisma.product.updateMany({ data: { isPublished: true } })
  await prisma.documentation.updateMany({ data: { isPublished: true } })
  await prisma.metric.updateMany({ data: { isPublished: true } })
  console.log('All records set to isPublished = true')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
