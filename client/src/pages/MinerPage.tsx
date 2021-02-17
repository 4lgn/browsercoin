import React, { useEffect } from 'react'
import { genNewWallet } from '../blockchainUtils'
import { broadcast, setupAndConfigurePeer } from '../p2pUtils'
import {
  Button,
  Flex,
  Link,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getBlockchain } from '../redux/flows/blockchain'
import { getPeer, setPeerNode } from '../redux/flows/peerNode'
import { getPendingTransactions } from '../redux/flows/pendingTransactions'
import usePeerCallbacks from '../usePeerCallbacks'
import { useMinerService } from '../useMinerService'
import worker from '../worker/workerInstance'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import { getChosenWallet } from '../redux/flows/wallet'

interface MinerPageProps {}

const MinerPage: React.FC<MinerPageProps> = () => {
  const dispatch = useDispatch()
  const blockchain = useSelector(getBlockchain)
  const peer = useSelector(getPeer)
  const wallet = useSelector(getChosenWallet)
  const pendingTransactions = useSelector(getPendingTransactions)
  const [mineBlock, mining, mineGenesisBlock] = useMinerService()

  return (
    <Flex>
      <Button
        disabled={mining}
        onClick={() => {
          if (blockchain.length === 0) {
            mineGenesisBlock()
          } else {
            mineBlock()
          }
        }}
      >
        {`Mine ${blockchain.length === 0 ? 'genesis' : 'new'} block`}
      </Button>
      <Button
        onClick={() => {
          if (peer) {
            broadcast(peer, {
              type: 'blockchain-query',
              peerId: peer.id,
            })
          }
        }}
      >
        Gather blockchains
      </Button>
      <Button
        onClick={() => {
          if (worker) {
            worker.cancel_mining()
          }
        }}
      >
        Cancel mining
      </Button>
    </Flex>
  )
}

export default MinerPage
