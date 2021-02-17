import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  BLOCKCHAIN_QUERY_NEIGHBOUR_THRESHOLD,
  BLOCKCHAIN_QUERY_RETRY_TIMEOUT_MS,
  BLOCKCHAIN_QUERY_MAX_RETRIES,
} from './constants'
import { broadcast } from './p2pUtils'
import { getPeer, getPeerNode } from './redux/flows/peerNode'

interface BlockchainProviderProps {}

const BlockchainProvider: React.FC<BlockchainProviderProps> = ({
  children,
}) => {
  const peer = useSelector(getPeer)
  const peerNode = useSelector(getPeerNode)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const blockchainQueryCount = useRef<number>(0)

  // Callback function that will be called every BLOCKCHAIN_QUERY_RETRY_TIMEOUT_MS
  // It broadcasts a blockchain query to all its peer neighbours if a threshold count is met
  const intervalCb = useCallback(() => {
    // Use peerNode for peer and neighbours in this, as neighbours has trouble
    // triggering correct update to the callback function.
    const { peer, neighbours } = peerNode
    console.log(blockchainQueryCount.current)
    if (peer && neighbours.length >= BLOCKCHAIN_QUERY_NEIGHBOUR_THRESHOLD) {
      console.log(
        'Broadcasting blockchain-query to ' +
          neighbours.length +
          ' neighbours...'
      )
      broadcast(peer, {
        type: 'blockchain-query',
        peerId: peer.id,
      })
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    if (
      intervalRef.current &&
      blockchainQueryCount.current >= BLOCKCHAIN_QUERY_MAX_RETRIES
    ) {
      clearInterval(intervalRef.current)
    }
    blockchainQueryCount.current += 1
  }, [peerNode])

  useEffect(() => {
    // On initial load with a peer connection, check for new neighbours every
    // second untill over BLOCKCHAIN_QUERY_NEIGHBOUR_THRESHOLD, and then broadcast a
    // blockchain-query out to all neighbours
    if (peer) {
      blockchainQueryCount.current = 0
      broadcast(peer, {
        type: 'blockchain-query',
        peerId: peer.id,
      })
      intervalRef.current = setInterval(
        intervalCb,
        BLOCKCHAIN_QUERY_RETRY_TIMEOUT_MS
      )
    }

    return () => {
      if (intervalRef.current) {
        console.log('Clearing interval')
        clearInterval(intervalRef.current)
      }
    }
  }, [peer])

  return <>{children}</>
}

export default BlockchainProvider
