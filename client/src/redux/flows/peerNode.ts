import Flow from 'redux-flow'
import { Action } from 'redux'
import { RootState } from '../types'
import Peer from 'peerjs'

export type PeerStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export type PeerNodeState = {
  peer: Peer | null
  neighbours: string[]
  status: PeerStatus
}

const initialState: PeerNodeState = {
  peer: null,
  neighbours: [],
  status: 'disconnected',
}

const { reducer, actions } = Flow('peerNode', {
  initialState: { ...initialState },
  mutations: {
    setPeerStatus(state, status: PeerStatus) {
      state.status = status
    },
    setPeerNode(state, peer: Peer) {
      state.peer = peer
    },
    addPeerNeighbour(state, peerId: string) {
      state.neighbours = [...state.neighbours, peerId]
    },
    removePeerNeighbour(state, peerId: string) {
      state.neighbours = [...state.neighbours].filter(_pId => _pId !== peerId)
    },
  },
  actions: {},
})

export const { getPeerNode, getPeerStatus, getPeer, getPeerNeighbours } = {
  getPeerNode(state: RootState) {
    return state.peerNode
  },
  getPeerStatus(state: RootState) {
    return state.peerNode.status
  },
  getPeer(state: RootState) {
    return state.peerNode.peer
  },
  getPeerNeighbours(state: RootState) {
    return state.peerNode.neighbours
  },
}

export const {
  setPeerStatus,
  setPeerNode,
  addPeerNeighbour,
  removePeerNeighbour,
}: {
  setPeerStatus: (status: PeerStatus) => Action
  setPeerNode: (peer: Peer) => Action
  addPeerNeighbour: (peerId: string) => Action
  removePeerNeighbour: (peerId: string) => Action
} = actions as any

export { reducer }
