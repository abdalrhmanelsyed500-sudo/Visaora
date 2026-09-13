import { PrismaClient } from "@prisma/client";
import { COUNTRIES } from "../src/lib/data/countries";
import { VISA_CATEGORIES } from "../src/lib/constants";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

async function main() {
  const regions = new Map<string, string>();
  for (const country of COUNTRIES) {
    const existingRegion = regions.get(country.region);
    if (existingRegion) continue;
    const region = await prisma.region.upsert({
      where: { slug: slugify(country.region) },
      update: { name: country.region, continent: country.continent },
      create: {
        name: country.region,
        slug: slugify(country.region),
        continent: country.continent,
      },
    });
    regions.set(country.region, region.id);
  }

  for (const country of COUNTRIES) {
    await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {
        name: country.name,
        officialName: country.officialName,
        iso3: country.iso3,
        numericCode: country.numericCode,
        continent: country.continent,
        subregion: country.subregion,
        capital: country.capital,
        flag: country.flag,
        slug: country.slug,
        status: "PUBLISHED",
        regionId: regions.get(country.region),
      },
      create: {
        name: country.name,
        officialName: country.officialName,
        iso2: country.iso2,
        iso3: country.iso3,
        numericCode: country.numericCode,
        continent: country.continent,
        subregion: country.subregion,
        capital: country.capital,
        flag: country.flag,
        slug: country.slug,
        status: "PUBLISHED",
        regionId: regions.get(country.region),
      },
    });
  }

  for (const category of VISA_CATEGORIES) {
    await prisma.visaCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        sortOrder: category.order,
        status: "PUBLISHED",
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        sortOrder: category.order,
        status: "PUBLISHED",
      },
    });
  }

  console.log(`Seeded ${COUNTRIES.length} country records and ${VISA_CATEGORIES.length} visa categories.`);
  console.log("No visa guides were seeded by design.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
