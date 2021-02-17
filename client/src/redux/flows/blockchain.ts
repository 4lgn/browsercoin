import Flow, { select } from 'redux-flow'
import { Action } from 'redux'
import { RootState } from '../types'
import { Block } from '../../types'

export type BlockchainState = {
  chain: Block[]
}

const initialState: BlockchainState = {
  chain: [],
}

const { reducer, actions } = Flow('blockchain', {
  initialState: { ...initialState },
  mutations: {
    setBlockchain(state, blockchain: Block[]) {
      if (blockchain === undefined) {
        console.log('lol')
        console.log(blockchain)
      }
      state.chain = blockchain
    },
    addBlock(state, block: Block) {
      state.chain.push(block)
    },
    // initializeBlockchain(state) {

    // }
  },
  actions: {},
})

export const { getBlockchain } = {
  getBlockchain(state: RootState) {
    return state.blockchain.chain
  },
}

export const {
  setBlockchain,
  addBlock,
}: {
  setBlockchain: (blockchain: Block[]) => Action
  addBlock: (block: Block) => Action
} = actions as any

export { reducer }
