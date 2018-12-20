const { Router } = require('express')
const router = new Router()

const Pokeball = require('./Pokeball')

router.get('/', (req, res) => {
  res.status(200).json({ info: 'some pokeballs' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ info: 'trying to get pokeball #' + req.params.id })
})

router.put('/:id/increase', (req, res) => {
  res
    .status(200)
    .json({ info: 'trying to increment pokeball #' + req.params.id })
})

router.put('/:id/decrease', (req, res) => {
  res
    .status(200)
    .json({ info: 'trying to decrement pokeball #' + req.params.id })
})

router.post('/', (req, res) => {
  res.status(201).json({ info: `pokeball creation` })
})

router.delete('/:id', (req, res) => {
  res.status(204).send()
})

module.exports = router
