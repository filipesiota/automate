import Fastify from 'fastify'
import PrismaClient from '@prisma/client'

const app = Fastify()
const prisma = new PrismaClient()

app.get('/users', async () => {
  return prisma.user.findMany()
})

app.listen({ port: 3000 }, () => {
  console.log('Server running on http://localhost:3000')
})
