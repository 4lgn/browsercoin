import Peer from 'peerjs'

export interface Block {
  index: number // block number
  previousHash: string // previous block hash
  timestamp: number // block creation timestamp
  transactions: Transaction[]
  hash?: string // block hash
  pow?: number // proof of work
}

export interface Transaction {
  from: string
  to: string
  amount: number
  timestamp: number
  hash?: string
  sig?: string
}

export interface Miner {
  address: string
  peerNodes: string[]
  blockchain: Block[]
  pendingTransactions: Transaction[]
}

export interface WalletKeys {
  pk: string
  sk: string
}

export interface Wallet {
  keys: WalletKeys
  bal: number
}

export type P2PMessage =
  | P2PMessage_Blockchain
  | P2PMessage_Tx
  | P2PMessage_Blockchain_Query

export interface P2PMessage_Blockchain {
  type: 'blockchain'
  payload: Block[]
}

export interface P2PMessage_Tx {
  type: 'tx'
  payload: Transaction
}

export interface P2PMessage_Blockchain_Query {
  type: 'blockchain-query'
  peerId: string
}
