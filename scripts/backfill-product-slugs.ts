import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log("Fetching products without slugs...");
  const products = await prisma.product.findMany({
    where: {
      slug: null,
    },
    include: {
      sector: true
    }
  });

  if (products.length === 0) {
    console.log("No products need backfilling.");
    return;
  }

  console.log(`Found ${products.length} products to update.`);

  for (const product of products) {
    let baseSlug = generateSlug(product.name);
    let slug = baseSlug;
    
    // Check for duplicates
    let counter = 1;
    let existing = await prisma.product.findFirst({ where: { slug } });
    
    while (existing) {
      if (counter === 1) {
        // First try appending sector name
        slug = `${baseSlug}-${generateSlug(product.sector.name)}`;
      } else {
        // Then try numbers
        slug = `${baseSlug}-${counter}`;
      }
      existing = await prisma.product.findFirst({ where: { slug } });
      counter++;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { slug }
    });
    console.log(`Updated product "${product.name}" with slug: ${slug}`);
  }

  console.log("Backfill completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
