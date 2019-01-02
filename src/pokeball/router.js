const { Router } = require('express')
const router = new Router()

const Pokeball = require('./Pokeball')
const searchPokemon = require('../pokemon/search')

router.get('/', findAll)
router.get('/search', search)
router.get('/:id', findById)
router.put('/:id/increase', increase)
router.put('/:id/decrease', decrease)
router.post('/', create)
router.delete('/:id', remove)

async function findAll(req, res) {
  try {
    const pokeballs = await Pokeball.find({})
    res.status(200).json(pokeballs)
  } catch (error) {
    res.status(500).json({
      message: 'An error occured while requesting pokeballs',
      error,
    })
  }
}

async function findById(req, res) {
  try {
    const pokeball = await Pokeball.findById(req.params.id)
    if (!pokeball) {
      return res.status(404).json({})
    }
    res.status(200).json(pokeball)
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid Pokeball ID' })
    } else {
      res.status(500).json({
        message: `An error occured while requesting pokeball with id ${
          req.params.id
        }`,
        error,
      })
    }
  }
}

async function create(req, res) {
  try {
    const pokeball = await Pokeball.create({ name: req.body.name })
    res.status(201).json(pokeball)
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).json({
        error: `Pokeball ${req.body.name} already exists`,
      })
    } else {
      res.status(500).json({
        message: 'An error occured while creating pokeball',
        error,
      })
    }
  }
}

async function remove(req, res) {
  try {
    await Pokeball.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      message: `An error occured while deleting pokeball with id ${
        req.params.id
      }`,
      error,
    })
  }
}

async function increase(req, res) {
  try {
    const pokeball = await Pokeball.findById(req.params.id)
    if (!pokeball) {
      return res.status(404).json({})
    }
    await pokeball.increase()
    res.status(200).json(pokeball)
  } catch (error) {
    res.status(500).json({
      message: `An error occured while increasing pokeball with id ${
        req.params.id
      }`,
      error,
    })
  }
}

async function decrease(req, res) {
  try {
    const pokeball = await Pokeball.findById(req.params.id)
    if (!pokeball) {
      return res.status(404).json({})
    }
    await pokeball.decrease()
    res.status(200).json(pokeball)
  } catch (error) {
    res.status(500).json({
      message: `An error occured while decreasing pokeball with id ${
        req.params.id
      }`,
      error,
    })
  }
}

async function search(req, res) {
  try {
    const searchQuery = req.query.q
    const [pokeballs, pokemon] = await Promise.all([
      Pokeball.find({
        $text: { $search: searchQuery },
      }),
      searchPokemon(searchQuery),
    ])
    res.status(200).json({ matched: { pokeballs, pokemon } })
  } catch (error) {
    res.status(500).json({
      message: `An error occured while searching pokeballs matching ${
        req.query.q
      }`,
      error,
    })
  }
}

module.exports = router
