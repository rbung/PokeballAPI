const request = require('supertest')
const sinon = require('sinon')
const Pokeball = require('./pokeball/Pokeball')
const nock = require('nock')

const app = require('./app')

describe('Root endpoint', () => {
  test('should respond correctly', () => {
    return request(app)
      .get('/')
      .expect(200)
      .then(res => {
        expect(res.text).toEqual('Welcome to Pokeball API 🐢')
      })
  })
})

describe('Pokeball API', () => {
  const sandbox = sinon.createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  describe('Exercice 1 : Find all', () => {
    test('1.1 : should return all pokeballs', () => {
      const pokeballs = [
        {
          stock: 1,
          _id: '5c23ee3c14f187e040e4524b',
          name: 'Pokeball',
        },
        {
          stock: 0,
          _id: '5c23ee3c14f187e040e4524c',
          name: 'Great Ball',
        },
      ]
      sandbox.stub(Pokeball, 'find').returns(Promise.resolve(pokeballs))

      return request(app)
        .get('/api/pokeballs')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual(pokeballs)
        })
    })

    test('1.2 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'find').throws(new Error('boom'))

      return request(app)
        .get('/api/pokeballs')
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: 'An error occured while requesting pokeballs',
            }),
          )
        })
    })
  })

  describe('Exercice 2 : Find one', () => {
    test('2.1 : should get a single pokeball', () => {
      const pokeball = {
        stock: 1,
        _id: '5c23ee3c14f187e040e4524b',
        name: 'Pokeball',
      }
      sandbox
        .stub(Pokeball, 'findById')
        .withArgs('5c23ee3c14f187e040e4524b')
        .returns(Promise.resolve(pokeball))

      return request(app)
        .get('/api/pokeballs/5c23ee3c14f187e040e4524b')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual(pokeball)
        })
    })

    test('2.2 : should return nothing when id is unknown', () => {
      sandbox.stub(Pokeball, 'findById').returns(Promise.resolve(null))

      return request(app)
        .get('/api/pokeballs/5c23ee3c14f187e040e4524b')
        .expect(404)
        .then(res => {
          expect(res.body).toEqual({})
        })
    })

    test('2.3 : should return bad request when id is invalid', () => {
      const error = new Error('CastError')
      error.name = 'CastError'
      error.kind = 'ObjectId'
      sandbox.stub(Pokeball, 'findById').throws(error)

      return request(app)
        .get('/api/pokeballs/5c23ee3c14f187e040e4524b')
        .expect(400)
        .then(res => {
          expect(res.body).toEqual({ error: 'Invalid Pokeball ID' })
        })
    })

    test('2.3 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'findById').throws(new Error('boom'))

      return request(app)
        .get('/api/pokeballs/5c23ee3c14f187e040e4524b')
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message:
                'An error occured while requesting pokeball with id 5c23ee3c14f187e040e4524b',
            }),
          )
        })
    })
  })

  describe('Exercice 3 : Create', () => {
    test('3.1 : should create a pokeball', () => {
      const pokeball = {
        stock: 0,
        _id: '5c23ee3c14f187e040e4524b',
        name: 'CreatedPokeball',
      }
      sandbox
        .stub(Pokeball, 'create')
        .withArgs({ name: 'CreatedPokeball' })
        .returns(Promise.resolve(pokeball))

      return request(app)
        .post('/api/pokeballs')
        .send({ name: 'CreatedPokeball' })
        .expect(201)
        .then(res => {
          expect(res.body).toEqual(pokeball)
        })
    })

    test('3.2 : should NOT create the pokeball if name already exists', () => {
      const error = new Error('Already exists')
      error.name = 'MongoError'
      error.code = 11000
      sandbox.stub(Pokeball, 'create').throws(error)

      return request(app)
        .post('/api/pokeballs')
        .send({ name: 'CreatedPokeball' })
        .expect(400)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              error: 'Pokeball CreatedPokeball already exists',
            }),
          )
        })
    })

    test('3.3 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'create').throws(new Error('boom'))

      return request(app)
        .post('/api/pokeballs')
        .send({ name: 'CreatedPokeball' })
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: 'An error occured while creating pokeball',
            }),
          )
        })
    })
  })

  describe('Exercice 4 : Delete', () => {
    test('4.1 : should delete a pokeball', () => {
      sandbox
        .stub(Pokeball, 'findByIdAndDelete')
        .withArgs('5c23ee3c14f187e040e4524b')
        .returns(Promise.resolve())

      return request(app)
        .delete('/api/pokeballs/5c23ee3c14f187e040e4524b')
        .expect(204)
    })

    test('4.2 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'findByIdAndDelete').throws(new Error('boom'))

      return request(app)
        .delete('/api/pokeballs/5c23ee3c14f187e040e4524b')
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message:
                'An error occured while deleting pokeball with id 5c23ee3c14f187e040e4524b',
            }),
          )
        })
    })
  })

  describe('Exercice 5 : Increase', () => {
    test('5.1 : should increase a pokeball', () => {
      const pokeball = {
        stock: 1,
        _id: '5c23ee3c14f187e040e4524b',
        name: 'Pokeball',
        increase: function() {
          this.stock = 2
        },
      }
      sandbox
        .stub(Pokeball, 'findById')
        .withArgs('5c23ee3c14f187e040e4524b')
        .returns(Promise.resolve(pokeball))

      return request(app)
        .put('/api/pokeballs/5c23ee3c14f187e040e4524b/increase')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              _id: '5c23ee3c14f187e040e4524b',
              stock: 2,
            }),
          )
        })
    })

    test('5.2 : should do nothing on an unknown pokeball', () => {
      sandbox.stub(Pokeball, 'findById').returns(Promise.resolve(null))

      return request(app)
        .put('/api/pokeballs/5c23ee3c14f187e040e4524b/increase')
        .expect(404)
        .then(res => {
          expect(res.body).toEqual({})
        })
    })

    test('5.3 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'findById').throws(new Error('boom'))

      return request(app)
        .put('/api/pokeballs/5c23ee3c14f187e040e4524b/increase')
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message:
                'An error occured while increasing pokeball with id 5c23ee3c14f187e040e4524b',
            }),
          )
        })
    })
  })

  describe('Exercice 5 : Decrease', () => {
    test('5.1 : should decrease a pokeball', () => {
      const pokeball = {
        stock: 1,
        _id: '5c23ee3c14f187e040e4524b',
        name: 'Pokeball',
        decrease: function() {
          this.stock = 0
        },
      }
      sandbox
        .stub(Pokeball, 'findById')
        .withArgs('5c23ee3c14f187e040e4524b')
        .returns(Promise.resolve(pokeball))

      return request(app)
        .put('/api/pokeballs/5c23ee3c14f187e040e4524b/decrease')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              _id: '5c23ee3c14f187e040e4524b',
              stock: 0,
            }),
          )
        })
    })

    test('5.2 : should do nothing on an unknown pokeball', () => {
      sandbox.stub(Pokeball, 'findById').returns(Promise.resolve(null))

      return request(app)
        .put('/api/pokeballs/5c23ee3c14f187e040e4524b/decrease')
        .expect(404)
        .then(res => {
          expect(res.body).toEqual({})
        })
    })

    test('5.3 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'findById').throws(new Error('boom'))

      return request(app)
        .put('/api/pokeballs/5c23ee3c14f187e040e4524b/decrease')
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message:
                'An error occured while decreasing pokeball with id 5c23ee3c14f187e040e4524b',
            }),
          )
        })
    })
  })

  describe('Exercice 6 : Search', () => {
    test('6.1 : should return matching pokeballs & pokemon', () => {
      const pokeballs = [
        {
          stock: 1,
          _id: '5c23ee3c14f187e040e4524b',
          name: 'Match pokeball 1',
        },
        {
          stock: 0,
          _id: '5c23ee3c14f187e040e4524c',
          name: 'Match pokeball 2',
        },
      ]
      const pokemon = {
        id: 132,
        name: 'match',
        order: 195,
        weight: 40,
      }
      sandbox.stub(Pokeball, 'find').returns(Promise.resolve(pokeballs))
      nock('https://pokeapi.co/api/v2/pokemon')
        .get('/match')
        .reply(200, pokemon)

      return request(app)
        .get('/api/pokeballs/search?q=match')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual({
            matched: {
              pokeballs,
              pokemon,
            },
          })
        })
    })

    test('6.2 : should return server error on an unexpected error', () => {
      sandbox.stub(Pokeball, 'find').throws(new Error('boom'))

      return request(app)
        .get('/api/pokeballs/search?q=match')
        .expect(500)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message:
                'An error occured while searching pokeballs matching match',
            }),
          )
        })
    })
  })
})
