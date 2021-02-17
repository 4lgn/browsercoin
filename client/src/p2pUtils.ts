import Peer from 'peerjs'
import { TRACKER_URL } from './constants'
import { P2PMessage } from './types'

export async function getPeerIDs() {
  try {
    const res = await fetch(TRACKER_URL)
    return (await res.json()).peers as string[]
  } catch (e) {
    console.error(e)
    return []
  }
}

// This is called for all connections we establish with other peers - but also
// any connections other peers establish with us. Thus a bidirectional binding
// will be created through this function.
// ... we bind supplied onData and onClose functions to the respective "data"
// and "close" events for our peer
const processConnection = (
  onData: (message: P2PMessage) => void,
  onClose: () => void,
  onConnection: (peerId: string) => void
) => (connection: Peer.DataConnection) => () => {
  onConnection(connection.peer)
  connection.on('data', onData)
  connection.on('close', onClose)
}

export async function sendPeerID(peerID: string) {
  return fetch(TRACKER_URL, {
    method: 'POST',
    body: JSON.stringify({ peerID }),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  })
}

export function setupAndConfigurePeer(
  onData: (message: P2PMessage) => void,
  onClose: () => void,
  onConnection: (peerId: string) => void
): Peer {
  const boundProcessConnection = processConnection(
    onData,
    onClose,
    onConnection
  )

  const peer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/broker',
    secure: false,
  })

  // On getting a Peer from PeerServer (broker) connect to all other peers
  peer.on('open', async peerID => {
    // Get all other pee ids
    const peerIds = await getPeerIDs()
    // Connect to all other peers than ourself
    const peerConnections = peerIds
      .filter(id => id !== peerID)
      .map(id => peer.connect(id))
    console.log(
      'PeerJS: Found ' + peerConnections.length + ' peer(s) to connect to...'
    )
    // For each of these connections, call the processConnection function after
    // each connection has been opened and processed by our broker server
    // (PeerServer)
    peerConnections.forEach(connection =>
      connection.on('open', () => {
        console.log('PeerJS: Opened connection (' + connection.peer + ')')

        boundProcessConnection(connection)()
      })
    )
  })

  // Whenever we get some connection (from other peers), bind this connection to
  // our processConnection function
  peer.on('connection', connection => {
    console.log('PeerJS: Received connection (' + connection.peer + ')')

    boundProcessConnection(connection)()
  })

  // Handle errors
  peer.on('error', error => {
    if (error.type === 'disconnected') {
      console.log('Peer disconnected')
      console.log(error)
    }
    console.warn(error)
  })

  // Handle closing
  peer.on('close', () => {
    console.log('Per closed')
  })

  return peer
}

export function broadcast(peer: Peer, message: P2PMessage) {
  const connectionIds = peer.connections
  Object.entries(connectionIds).map(([peerId, value]) => {
    const connectionArray = value as Peer.DataConnection[]
    if (connectionArray.length > 0) {
      const connection = connectionArray[0]
      connection.send(message)
    }
  })
}

export function sendMsgToPeerId(
  fromPeer: Peer,
  toPeerId: string,
  message: P2PMessage
) {
  const connectionIds = fromPeer.connections
  const existingPeerConnection = connectionIds[toPeerId]
  if (existingPeerConnection) {
    const connectionArray = existingPeerConnection as Peer.DataConnection[]
    if (connectionArray.length > 0) {
      const connection = connectionArray[0]
      connection.send(message)
    }
  } else {
    const connection = fromPeer.connect(toPeerId)
    connection.send(message)
  }
}
