const { createServer } = require('http')
const chalk = require('chalk')
const connection = require('./connection')

const app = require('./app')

connection.dbConnected(() => {
  const PORT = Number(process.env.PORT) || 3000

  console.log(chalk`{green Starting server ...}`)
  const server = createServer(app)

  server.listen(PORT, () => {
    console.log(chalk`{green ✔ Server started on port} {cyan ${PORT}}`)
  })
})
