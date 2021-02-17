import React, { useEffect } from 'react'
import { genNewWallet } from './blockchainUtils'
import { broadcast, setupAndConfigurePeer } from './p2pUtils'
import { Button, Link, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getBlockchain } from './redux/flows/blockchain'
import { getPeer, setPeerNode } from './redux/flows/peerNode'
import { getPendingTransactions } from './redux/flows/pendingTransactions'
import usePeerCallbacks from './usePeerCallbacks'
import { useMinerService } from './useMinerService'
import worker from './worker/workerInstance'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import { getChosenWallet } from './redux/flows/wallet'

interface MinerContainerProps {}

const MinerContainer: React.FC<MinerContainerProps> = () => {
  const dispatch = useDispatch()
  const blockchain = useSelector(getBlockchain)
  const peer = useSelector(getPeer)
  const wallet = useSelector(getChosenWallet)
  const pendingTransactions = useSelector(getPendingTransactions)
  const [onPeerData, onPeerClosed, onPeerConnection] = usePeerCallbacks()
  const [mineBlock, mining, mineGenesisBlock] = useMinerService()

  useEffect(() => {
    if (blockchain.length === 0) {
      mineGenesisBlock()
    }

    if (!peer) {
      dispatch(
        setupAndConfigurePeer(onPeerData, onPeerClosed, onPeerConnection)
      )
    }
  }, [])

  if (!wallet) {
    return <div>No wallet chosen</div>
  }

  return (
    <div>
      <span>{wallet.keys.pk}</span>
      <div>
        <Button
          disabled={mining}
          onClick={() => {
            mineBlock()
          }}
        >
          Mine new block
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
      </div>
      <div>
        <span>Pending transactions:</span>
        <div>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Amount</Th>
                <Th>Age</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pendingTransactions.transactions.map(tx => (
                <Tr>
                  <Th>{tx.from}</Th>
                  <Th>{tx.to}</Th>
                  <Th>{tx.amount}</Th>
                  <Th>{tx.timestamp}</Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>
      <div>
        <span>Blockchain:</span>
        <div>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Block #</Th>
                <Th>Transactions</Th>
                <Th>Total sent</Th>
                <Th>Age</Th>
                <Th>Size</Th>
              </Tr>
            </Thead>
            <Tbody>
              {blockchain.map((_, index, arr) => {
                // Start from most recent block
                const block = arr[arr.length - index - 1]
                return (
                  <Tr>
                    <Th>
                      <Link
                        as={RouterLink}
                        to={`block/${block.index}`}
                        color="teal"
                      >
                        {block.index}
                      </Link>
                    </Th>
                    <Th>{block.transactions.length}</Th>
                    <Th>
                      {block.transactions.reduce(
                        (acc, tx) => acc + tx.amount,
                        0
                      )}
                    </Th>
                    <Th>
                      {moment(block.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Th>
                    <Th>
                      {Math.round(
                        Buffer.byteLength(JSON.stringify(block)) / 100
                      ) / 10}{' '}
                      KB
                    </Th>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default MinerContainer
