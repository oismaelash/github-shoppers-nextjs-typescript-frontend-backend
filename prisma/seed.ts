import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const LOAD_TEST_USERS = 50;
const SESSIONS_EXPIRY_DAYS = 7;

async function main() {
  const sessionsOutput: { email: string; sessionToken: string }[] = [];

  for (let n = 0; n < LOAD_TEST_USERS; n++) {
    const email = `k6user${n}@test.com`;
    const name = `k6-user-${n}`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
      },
    });

    const expires = new Date(Date.now() + SESSIONS_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    let sessionToken: string;
    if (existingSession) {
      sessionToken = randomUUID();
      await prisma.session.update({
        where: { id: existingSession.id },
        data: { sessionToken, expires },
      });
    } else {
      sessionToken = randomUUID();
      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires,
        },
      });
    }

    sessionsOutput.push({ email, sessionToken });
  }

  let loadTestItem = await prisma.item.findFirst({
    where: { name: "Load Test Product" },
  });
  if (!loadTestItem) {
    loadTestItem = await prisma.item.create({
      data: {
        name: "Load Test Product",
        description: "Load test",
        price: 1,
        quantity: 10,
      },
    });
  } else {
    await prisma.item.update({
      where: { id: loadTestItem.id },
      data: { quantity: 10 },
    });
  }

  const outDir = path.join(__dirname, "..", "tests", "load");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "sessions.json"),
    JSON.stringify(sessionsOutput, null, 2)
  );

  fs.writeFileSync(
    path.join(outDir, "product.json"),
    JSON.stringify({ id: loadTestItem.id }, null, 2)
  );

  console.log(`Created ${sessionsOutput.length} users with sessions and 1 load test item.`);
  console.log(`Wrote tests/load/sessions.json and tests/load/product.json`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
