import prisma from "../src/prismaClient.js";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("password", 10);

 await prisma.user.upsert({
  where: { email: "alice@example.com" },
  update: {},
  create: {
    username: "alice",
    email: "alice@example.com",
    password: "1234"
  }
});

await prisma.user.upsert({
  where: { email: "bob@example.com" },
  update: {},
  create: {
    username: "bob",
    email: "bob@example.com",
    password: "1234"
  }
});

  console.log("Seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
