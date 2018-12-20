const chalk = require('chalk')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/pokeball')

const db = mongoose.connection
db.on('error', () => {
  console.error(chalk`{red ✘ CANNOT CONNECT TO mongoDB DATABASE pokeball!}`)
})

function listenToConnectionOpen(onceReady) {
  if (typeof onceReady === 'function') {
    db.on('open', onceReady)
  }
}

module.exports = {
  dbConnected: listenToConnectionOpen,
}
