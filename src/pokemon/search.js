const wretch = require('wretch')

wretch().polyfills({
  fetch: require('node-fetch'),
  FormData: require('form-data'),
  URLSearchParams: require('url').URLSearchParams,
})

function search(input = '') {
  if (!input) {
    return {}
  }
  return wretch()
    .url('https://pokeapi.co/api/v2/pokemon')
    .url(`/${input}`)
    .get()
    .notFound(() => ({}))
    .json(({ id, name, order, weight }) => ({
      id,
      name,
      order,
      weight,
    }))
}

module.exports = search
