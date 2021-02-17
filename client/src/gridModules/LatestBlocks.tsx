import { Button, Link, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import React from 'react'
import { useSelector } from 'react-redux'
import { getBlockchain } from '../redux/flows/blockchain'
import moment from 'moment'

interface LatestBlocksProps {}

const LatestBlocks: React.FC<LatestBlocksProps> = () => {
  const blockchain = useSelector(getBlockchain)

  return (
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
              <Tr key={index}>
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
                  {block.transactions.reduce((acc, tx) => acc + tx.amount, 0)}
                </Th>
                <Th>{moment(block.timestamp).format('DD/MM/YYYY HH:mm:ss')}</Th>
                <Th>
                  {Math.round(Buffer.byteLength(JSON.stringify(block)) / 100) /
                    10}{' '}
                  KB
                </Th>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </div>
  )
}

export default LatestBlocks
