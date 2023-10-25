const express = require('express')
const app = express()
const port = 3000

app.get('/', (_req, res) => {
  res.send('Running!')
})

app.get('/status/', (_req, res) => {
  res.json({result: 'pong'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})