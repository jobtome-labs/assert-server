async function plugin (fastify, opts) {
  fastify.get('/javascript', async (req, reply) => {
    return { hello: 'Javascript example' }
  })
}

export default plugin