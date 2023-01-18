async function plugin (fastify: any, opts: any) {
  fastify.get('/nested', async (req: any, reply: any) => {
    return { hello: 'Nested example' }
  })
}

export default plugin