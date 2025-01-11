import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV !== "production") {
  // In non-production environments, a new Prisma Client is created every time the module is imported
  console.log("Creating new Prisma client instance in non-production environment");
  prisma = new PrismaClient();
} else {
  // In production, use a global Prisma Client to avoid creating multiple instances
  if (!global.prisma) {
    console.log("Creating global Prisma client instance in production environment");
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export const database = prisma;
