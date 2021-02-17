import produce from 'immer'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createEmptyBlock, MINING_REWARD } from './blockchainUtils'
import { getBlockchain, setBlockchain } from './redux/flows/blockchain'
import { getPeer } from './redux/flows/peerNode'
import {
  getPendingTransactions,
  setPendingTransactions,
} from './redux/flows/pendingTransactions'
import { Block, Transaction } from './types'
import worker from './worker/workerInstance'
import moment from 'moment'
import { broadcast } from './p2pUtils'
import Peer from 'peerjs'
import { getChosenWallet } from './redux/flows/wallet'

export function useMinerService(): [() => void, boolean, () => void] {
  const dispatch = useDispatch()
  const blockchain = useSelector(getBlockchain)
  const peer = useSelector(getPeer)
  const wallet = useSelector(getChosenWallet)
  const pendingTransactions = useSelector(getPendingTransactions)
  const [mining, setMining] = useState<boolean>(false)

  // Need to keep mutable ref objects as these functions can be called from
  // onPeerData which is outside of react state hook updates
  const blockchainRef = useRef<Block[]>([])
  const peerRef = useRef<Peer | null>(null)
  const pendingTransactionsRef = useRef<Transaction[]>([])
  blockchainRef.current = blockchain
  peerRef.current = peer
  pendingTransactionsRef.current = pendingTransactions.transactions

  const startWorkerMiningJob = (block: Block): Promise<Block | null> => {
    return new Promise(async (resolve, reject) => {
      // Use a web worker to mine the block
      if (worker) {
        const minedBlock: Block | null = await worker.mine_WORKER(block)
        return resolve(minedBlock)
      }
      reject('No instantiated worker thread')
    })
  }

  const mineBlock = async () => {
    if (worker) {
      const workerStatus = await worker.status()
      // We don't want to start mining another block if we are already mining one
      if (workerStatus === 'alive') return
    }
    // We need to make use of our ref here as it can be called from onPeerData
    const blockchain = blockchainRef.current
    const peer = peerRef.current
    const pendingTransactions = pendingTransactionsRef.current
    if (!blockchain || !wallet) return

    const lastBlock = blockchain[blockchain.length - 1]
    const newBlock = createEmptyBlock(lastBlock.index + 1, lastBlock.hash)
    // Set transactions to all those we have pending (they are verified)
    newBlock.transactions = pendingTransactions
    // Push our reward transaction to the top
    newBlock.transactions = produce(newBlock.transactions, draft => {
      draft.unshift({
        amount: MINING_REWARD,
        timestamp: parseInt(moment().format('x')),
        from: '__mining_reward__',
        to: wallet.keys.pk,
      })
    })
    setMining(true)
    // TODO: Place something that checks if we have gotten a new
    // blockchain in this time, and check if it is longer than ours
    // after we have mined the block - then avoid setting state to
    // smaller blockchainn
    const minedNewBlock = await startWorkerMiningJob(newBlock)
    setMining(false)
    // If mined block was null we cancelled the mining, thus just return
    if (!minedNewBlock) return

    const newBlockchain = produce(blockchain, draft => {
      draft.push(minedNewBlock)
    })
    dispatch(setBlockchain(newBlockchain))
    // If we were the ones who successfully mined the block, we can remove the
    // transactions we succesfully put into our block from our pending
    // transactions
    // (we also remove any block reward transactions, of course)
    // TODO: Maybe refactor this bit of code
    dispatch(
      setPendingTransactions(
        pendingTransactions.filter(
          tx =>
            tx.from !== '__mining_reward__' &&
            !newBlock.transactions.includes(tx)
        )
      )
    )
    // Broadcast new blockchain out to all other peers
    if (peer) {
      broadcast(peer, {
        type: 'blockchain',
        payload: newBlockchain,
      })
    }
  }

  const mineGenesisBlock = async () => {
    if (!wallet) return
    const genesisBlock = createEmptyBlock(0)
    // Blockchain starter receives 10.000
    genesisBlock.transactions.push({
      amount: 10000,
      from: '__genesis__',
      timestamp: 0,
      to: wallet.keys.pk,
    })
    setMining(true)
    const minedBlock = await startWorkerMiningJob(genesisBlock)
    setMining(false)
    // If mined block was null we cancelled the mining, thus just return
    if (!minedBlock) return
    const newBlockchain = [minedBlock]
    dispatch(setBlockchain(newBlockchain))
  }

  return [mineBlock, mining, mineGenesisBlock]
}
