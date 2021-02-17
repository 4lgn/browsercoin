import express from 'express'
import { ExpressPeerServer } from 'peer'
import http from 'http'
import cors from 'cors'

const app = express()
const server = http.createServer(app)
const peerServer = ExpressPeerServer(server, {
  path: '/',
})

app.use('/broker', peerServer)
app.use(express.json())
app.use(cors())

const peers = new Set()

app.get('/', (req, res, next) => res.send('Hello world!'))

app.get('/tracker', (req, res, next) => {
  res.json({ peers: Array.from(peers) })
})

peerServer.on('connection', client => {
  peers.add(client.getId())
  console.log('Added ' + client.getId())
})

peerServer.on('disconnect', client => {
  peers.delete(client.getId())
  console.log('Removed ' + client.getId())
})

server.listen(9000, () => {
  console.log('Server listening!')
})
