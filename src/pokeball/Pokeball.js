const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pokeballSchema = new Schema({
  name: { type: String, unique: true },
  stock: { type: Number, default: 0 },
})
pokeballSchema.index({ name: 'text' })

pokeballSchema.methods.increase = function() {
  this.stock++
  return Pokeball.findByIdAndUpdate(this._id, { stock: this.stock })
}

pokeballSchema.methods.decrease = function() {
  if (this.stock === 0) {
    return
  }
  this.stock--
  return Pokeball.findByIdAndUpdate(this._id, { stock: this.stock })
}

pokeballSchema.methods.delete = function() {
  return Pokeball.findByIdAndDelete(this._id)
}

const Pokeball = mongoose.model('Pokeball', pokeballSchema)

module.exports = Pokeball
