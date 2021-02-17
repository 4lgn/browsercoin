import Peer from 'peerjs'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { consensus, getBalanceOfWallet, txIsValid } from './blockchainUtils'
import { sendMsgToPeerId } from './p2pUtils'
import { getBlockchain, setBlockchain } from './redux/flows/blockchain'
import {
  addPeerNeighbour,
  getPeer,
  removePeerNeighbour,
} from './redux/flows/peerNode'
import { addPendingTransaction } from './redux/flows/pendingTransactions'
import { Block, P2PMessage } from './types'
import { useMinerService } from './useMinerService'

export default function useOnPeerData(): [
  (msg: P2PMessage) => void,
  () => void,
  (peerId: string) => void
] {
  const dispatch = useDispatch()
  const [mineBlock] = useMinerService()
  const blockchain = useSelector(getBlockchain)
  const peer = useSelector(getPeer)

  const blockchainRef = useRef<Block[]>([])
  const peerRef = useRef<Peer | null>(null)

  blockchainRef.current = blockchain
  peerRef.current = peer

  const onPeerData = (msg: P2PMessage) => {
    console.log('PeerJS: Got msg:')
    console.log(msg)

    // Ease readability by re-binding ref values
    const blockchain = blockchainRef.current
    const peer = peerRef.current

    switch (msg.type) {
      case 'blockchain':
        if (blockchain) {
          dispatch(setBlockchain(consensus([blockchain, msg.payload])))
        }
        break
      case 'blockchain-query':
        if (peer && blockchain) {
          sendMsgToPeerId(peer, msg.peerId, {
            type: 'blockchain',
            payload: blockchain,
          })
        }
        break
      case 'tx':
        if (txIsValid(msg.payload, blockchain)) {
          dispatch(addPendingTransaction(msg.payload))

          // if (pendingTransactionsRef.current.length < 10)
          // console.log('mining block...')
          mineBlock()
        } else {
          console.log('Received an invalid transaction!')
        }
        break
    }
  }

  const onPeerClosed = () => {
    console.log('PeerJS: Peer connection closed')
  }

  const onPeerConnection = (peerId: string) => {
    dispatch(addPeerNeighbour(peerId))
  }

  return [onPeerData, onPeerClosed, onPeerConnection]
}
