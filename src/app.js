const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const pokeballApi = require('./pokeball/router')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Pokeball API 🐢')
})

app.use('/api/pokeballs', pokeballApi)

module.exports = app
