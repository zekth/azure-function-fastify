const { test } = require('tap')
const fastify = require('fastify')
const fs = require('fs')
const path = require('path')
const azureFunctionFastify = require('../index')

test('GET, promise', (t) => {
  t.plan(10)
  const app = fastify()
  let doneCalled = 0
  app.get('/test', async (request, reply) => {
    t.equal(request.headers['x-fastify-x'], 'is-neat')
    t.equal(request.headers['user-agent'], 'lightMyRequest')
    reply.header('Set-Cookie', 'i=love')
    reply.header('Set-Cookie', 'mechanical=keyboards')
    reply.send({ hello: 'world' })
  })

  const handler = azureFunctionFastify(app)
  const ctx = {
    req: {
      method: 'GET',
      originalUrl: '/test',
      headers: {
        'x-fastify-x': 'is-neat'
      }
    },
    done: () => {
      doneCalled++
    }
  }
  handler(ctx).then((_ctx) => {
    t.equal(doneCalled, 1)
    t.equal(_ctx.res.status, 200)
    t.equal(_ctx.res.body, JSON.stringify({ hello: 'world' }))
    t.equal(
      _ctx.res.headers['content-type'],
      'application/json; charset=utf-8'
    )
    t.equal(_ctx.res.headers.connection, 'keep-alive')
    t.same(_ctx.res.cookies[0], { name: 'i', value: 'love' })
    t.same(_ctx.res.cookies[1], { name: 'mechanical', value: 'keyboards' })
    t.equal(_ctx.res.isRaw, true)
  })
})

test('GET, callback', (t) => {
  t.plan(11)
  const app = fastify()
  let doneCalled = 0
  app.get('/test', async (request, reply) => {
    t.equal(request.headers['x-fastify-x'], 'is-neat')
    t.equal(request.headers['user-agent'], 'lightMyRequest')
    reply.header('Set-Cookie', 'i=love')
    reply.header('Set-Cookie', 'mechanical=keyboards')
    reply.send({ hello: 'world' })
  })

  const callback = (err, _ctx) => {
    t.error(err)
    t.equal(doneCalled, 1)
    t.equal(_ctx.res.status, 200)
    t.equal(_ctx.res.body, JSON.stringify({ hello: 'world' }))
    t.equal(
      _ctx.res.headers['content-type'],
      'application/json; charset=utf-8'
    )
    t.equal(_ctx.res.headers.connection, 'keep-alive')
    t.same(_ctx.res.cookies[0], { name: 'i', value: 'love' })
    t.same(_ctx.res.cookies[1], { name: 'mechanical', value: 'keyboards' })
    t.equal(_ctx.res.isRaw, true)
  }
  const handler = azureFunctionFastify(app, {}, callback)
  const ctx = {
    req: {
      method: 'GET',
      originalUrl: '/test',
      headers: {
        'x-fastify-x': 'is-neat'
      }
    },
    done: () => {
      doneCalled++
    }
  }
  handler(ctx)
})

test('Post', (t) => {
  t.plan(6)
  const app = fastify()
  let doneCalled = 0
  app.post('/test', async (request, reply) => {
    t.same(request.body, { tokiwo: 'tomare' })
    reply.send({ za: 'warudo' })
  })

  const handler = azureFunctionFastify(app)
  const ctx = {
    req: {
      method: 'POST',
      originalUrl: '/test',
      headers: {},
      body: { tokiwo: 'tomare' }
    },
    done: () => {
      doneCalled++
    }
  }
  handler(ctx).then((_ctx) => {
    t.equal(doneCalled, 1)
    t.equal(_ctx.res.status, 200)
    t.equal(_ctx.res.body, JSON.stringify({ za: 'warudo' }))
    t.equal(
      _ctx.res.headers['content-type'],
      'application/json; charset=utf-8'
    )
    t.equal(_ctx.res.isRaw, true)
  })
})

test('Error', (t) => {
  t.plan(6)
  const app = fastify()
  let doneCalled = 0
  app.get('/test', async (request, reply) => {
    throw new Error('RIP')
  })

  const handler = azureFunctionFastify(app)
  const ctx = {
    req: {
      method: 'GET',
      originalUrl: '/test',
      headers: {}
    },
    done: () => {
      doneCalled++
    }
  }
  handler(ctx).then((_ctx) => {
    t.equal(doneCalled, 1)
    t.equal(_ctx.res.status, 500)
    t.equal(
      _ctx.res.body,
      JSON.stringify({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'RIP'
      })
    )
    t.equal(
      _ctx.res.headers['content-type'],
      'application/json; charset=utf-8'
    )
    t.equal(_ctx.res.headers.connection, 'keep-alive')
    t.equal(_ctx.res.isRaw, true)
  })
})

test('Binary', (t) => {
  t.plan(5)
  const app = fastify()
  const imgBuffer = fs.readFileSync(path.join(__dirname, 'img.jpg'))
  let doneCalled = 0
  const handler = azureFunctionFastify(app, {
    binaryMimeTypes: ['image/jpeg']
  })
  const ctx = {
    req: {
      method: 'GET',
      originalUrl: '/test',
      headers: {}
    },
    done: () => {
      doneCalled++
    }
  }
  app.get('/test', async (request, reply) => {
    return reply.type('image/jpeg').status(200).send(imgBuffer)
  })
  handler(ctx).then((_ctx) => {
    t.equal(doneCalled, 1)
    t.equal(_ctx.res.status, 200)
    t.same(_ctx.res.body, imgBuffer)
    t.equal(_ctx.res.headers['content-type'], 'image/jpeg')
    t.equal(_ctx.res.isRaw, true)
  })
})
