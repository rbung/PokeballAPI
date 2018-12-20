const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pokeballSchema = new Schema({
  name: { type: String, unique: true },
  stock: { type: Number, default: 0 },
})

pokeballSchema.methods.increase = function() {
  return this.update({ stock: this.stock + 1 })
}

pokeballSchema.methods.decrease = function() {
  const newStock = this.stock === 0 ? 0 : this.stock - 1
  return this.update({ stock: newStock })
}

pokeballSchema.methods.delete = function() {
  return Pokeball.findByIdAndDelete(this._id)
}

const Pokeball = mongoose.model('Pokeball', pokeballSchema)

module.exports = Pokeball
