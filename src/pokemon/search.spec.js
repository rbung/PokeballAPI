const nock = require('nock')

const search = require('./search')

beforeAll(() => {
  nock.disableNetConnect()
})

afterAll(() => {
  nock.enableNetConnect()
})

test('should return a pokemon', async () => {
  expect.assertions(1)

  const pokemon = {
    id: 132,
    name: 'ditto',
    order: 195,
    weight: 40,
  }

  nock('https://pokeapi.co/api/v2/pokemon')
    .get('/ditto')
    .reply(200, pokemon)

  const actual = await search('ditto')
  expect(actual).toEqual(pokemon)
})

test('should return empty object if input is undefined', () => {
  expect.assertions(1)
  const pokemon = search(undefined)
  expect(pokemon).toEqual({})
})

test('should return empty object with an unknown pokemon', async () => {
  expect.assertions(1)

  nock('https://pokeapi.co/api/v2/pokemon')
    .get('/unknown')
    .reply(404)

  const pokemon = await search('unknown')
  expect(pokemon).toEqual({})
})
