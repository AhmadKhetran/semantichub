/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function seed() {
  const prisma = new PrismaClient();

  const createUser = async (email: string, password: string) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: "semantic",
          role: "SUPER_ADMIN",
        },
      });

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  };

  try {
    const superAdmin = await createUser("admin@semantichub.com", "admin@semantic");
  } finally {
    await prisma.$disconnect();
    console.log("Data seeded successfully");
  }
}

seed().catch((error) => {
  console.error("Error seeding data:", error);
});
