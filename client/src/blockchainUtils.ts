import { Block, Transaction, WalletKeys } from './types'
import moment from 'moment'
import CryptoJS from 'crypto-js'
import Elliptic from 'elliptic'

const EC = Elliptic.ec
const ec = new EC('secp256k1')

export const POW_DIFFICULTY = 3
export const MINING_REWARD = 50

// Generate sha-256 hash of a given block
export function hash(block: Block) {
  const blockString = JSON.stringify(block, Object.keys(block).sort())
  return CryptoJS.SHA256(blockString).toString()
}

// Determines if hash begins with the difficulter number of 0's
export function powIsAcceptable(hashOfBlock: string) {
  return hashOfBlock.slice(0, POW_DIFFICULTY) === '0'.repeat(POW_DIFFICULTY)
}

// Generate random 32 byte string
export function nonce() {
  return CryptoJS.SHA256(CryptoJS.lib.WordArray.random(32)).toString()
}

// New empty block (without POW)
export function createEmptyBlock(index: number, previousHash?: string): Block {
  const newBlock: Block = {
    index: index,
    previousHash: previousHash || '',
    timestamp: parseInt(moment().format('x')), // *nix timestamp
    transactions: [],
  }
  newBlock.hash = hash(newBlock)
  return newBlock
}

// Proof-of-work algorithm (brute force correct hash)
export function mine(block: Block) {
  block.pow = 0
  while (true) {
    block.pow++
    if (powIsAcceptable(hash(block))) {
      return block
    }
  }
}

// Generator new pub/priv key pair for a wallet
export function genNewWallet(): WalletKeys {
  const key = ec.genKeyPair()
  const sk = key.getPrivate().toString('hex')
  const pk = key.getPublic().encode('hex', true)
  return { sk, pk }
}

export function createAndSignTx(
  wallet: WalletKeys,
  to: string,
  amount: number
): Transaction {
  const key = ec.keyFromPrivate(wallet.sk)
  const tx: Transaction = {
    amount,
    from: wallet.pk,
    to,
    timestamp: parseInt(moment().format('x')),
  }
  const txHash = CryptoJS.SHA256(JSON.stringify(tx)).toString()
  tx.hash = txHash
  tx.sig = key.sign(txHash).toDER('hex')
  return tx
}

export function isNetworkTx(tx: Transaction) {
  // Reward and genesis transactions does not need signatures
  return tx.from === '__genesis__' || tx.from === '__mining_reward__'
}

export function verifyTxSig(tx: Transaction) {
  if (isNetworkTx(tx)) return true

  const key = ec.keyFromPublic(tx.from, 'hex')
  if (tx.hash && tx.sig) {
    return key.verify(tx.hash, tx.sig)
  }
  return false
}

export function txIsOverSpent(tx: Transaction, blockchain: Block[]) {
  if (isNetworkTx(tx)) return false

  return tx.amount > getBalanceOfWallet(tx.from, blockchain)
}

export function txIsValid(tx: Transaction, blockchain: Block[]) {
  return verifyTxSig(tx) && !txIsOverSpent(tx, blockchain)
}

export function validateBlockchain(blockchain: Block[]) {
  let chainIsValid = true

  for (let i = 0; chainIsValid && i < blockchain.length; i++) {
    const block = blockchain[i]
    // Check hash
    if (hash(block) !== block.hash) chainIsValid = false

    // Check POW
    if (block.hash && !powIsAcceptable(block.hash)) chainIsValid = false

    // Check transactions
    const blocksTillNow = blockchain.slice(0, i)
    if (!block.transactions.every(tx => txIsValid(tx, blocksTillNow)))
      chainIsValid = false

    // All transactions must have a unique timestamp
    // TODO: Maybe there is a smarter/better way of doing this? This will
    // probably incur problems with high concurreny and a lot of transactions...
    // Maybe make it unique per wallet address?
    const containsDuplicateTimestamps =
      new Set(block.transactions.map(tx => tx.timestamp)).size !==
      block.transactions.length
    if (containsDuplicateTimestamps) chainIsValid = false

    // Check previous block
    if (i >= 1) {
      const previousBlock = blockchain[i - 1]
      if (block.previousHash !== previousBlock.hash) chainIsValid = false
    }
  }

  return chainIsValid
}

export function consensus(blockchains: Block[][]) {
  // TODO: This can be done more efficiently by sorting by length and going down
  // untill a valid blockchain is found

  // Filter away invalid blockchains
  const filteredBlockchains = blockchains.filter(
    blockchain => !validateBlockchain(blockchain)
  )
  if (blockchains.length < 1) return []

  // Sort by length in descending order
  const sortedBlockchains = filteredBlockchains.sort(
    (a, b) => b.length - a.length
  )

  // Find longest blockchain
  if (sortedBlockchains.length > 0) {
    const longestBlockchain = sortedBlockchains[0]
    return longestBlockchain
  }

  return []
}

export function getBalanceOfWallet(pk: string, blockchain: Block[]) {
  let bal = 0

  blockchain.forEach(block => {
    block.transactions.forEach(tx => {
      if (tx.from === pk) {
        bal -= tx.amount
      }
      if (tx.to === pk) {
        bal += tx.amount
      }
    })
  })

  return bal
}
