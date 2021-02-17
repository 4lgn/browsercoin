import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setupAndConfigurePeer } from './p2pUtils'
import {
  getPeer,
  getPeerStatus,
  setPeerNode,
  setPeerStatus,
} from './redux/flows/peerNode'
import usePeerCallbacks from './usePeerCallbacks'

const PeerProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const peer = useSelector(getPeer)
  const [onPeerData, onPeerClosed, onPeerConnection] = usePeerCallbacks()
  const peerStatus = useSelector(getPeerStatus)

  useEffect(() => {
    if (!peer) {
      dispatch(setPeerStatus('connecting'))
      dispatch(
        setPeerNode(
          setupAndConfigurePeer(onPeerData, onPeerClosed, onPeerConnection)
        )
      )
    }
  }, [])

  useEffect(() => {
    console.log('Peer changed')
    console.log(peer)
    if (peer && peerStatus !== 'connected') {
      dispatch(setPeerStatus('connected'))
    }
    // TODO: Maybe check if disconnected here?
  }, [peer, peerStatus])

  return <>{children}</>
}

export default PeerProvider
