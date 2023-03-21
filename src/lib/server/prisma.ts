import { PrismaClient } from "@prisma/client"

const prisma = global.prisma || new PrismaClient() // Instancia de prisma. Si existía ya una global se usa esa.

if (process.env.NODE_ENV === "development") { // Si el entorno es de desarrollo 
	global.prisma = prisma                    // global.prisma = nueva instancia de prisma.
}

export { prisma }  // Nos aseguramos de que solo hay una instancia de prismaClient en toda la aplicación
