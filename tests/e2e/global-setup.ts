import { execFileSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import path from "node:path";

const TEST_DATABASE_URL = "file:./test.db";

export default async function globalSetup() {
  process.env.DATABASE_URL = TEST_DATABASE_URL;

  const prismaDir = path.join(process.cwd(), "prisma");
  // Remove any prior test DB plus SQLite sidecar files.
  for (const suffix of ["", "-journal", "-wal", "-shm"]) {
    const p = path.join(prismaDir, `test.db${suffix}`);
    if (existsSync(p)) rmSync(p);
  }

  const env = { ...process.env, DATABASE_URL: TEST_DATABASE_URL };

  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env,
  });
  execFileSync("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "inherit",
    env,
  });
}
