import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrations: {
    seed: 'ts-node --compiler-options {\\"module\\":\\"CommonJS\\"} prisma/seed.ts',
  },
  datasource: {
    url: 'file:./dev.db',
  },
})
