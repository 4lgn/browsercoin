import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/table'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getBlockchain } from '../redux/flows/blockchain'
import moment from 'moment'

interface BlockPageProps {}

const BlockPage: React.FC<BlockPageProps> = () => {
  const { id } = useParams<{ id: string }>()
  const blockchain = useSelector(getBlockchain)
  const block = blockchain[parseInt(id)]

  if (!block) {
    return <div>Block not found</div>
  }

  return (
    <div>
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Th>Block</Th>
            <Th>#{id}</Th>
          </Tr>
          <Tr>
            <Th>Hash</Th>
            <Th>{block.hash}</Th>
          </Tr>
          <Tr>
            <Th>Previous Hash</Th>
            <Th>{block.previousHash}</Th>
          </Tr>
          <Tr>
            <Th>Created</Th>
            <Th>{moment(block.timestamp).format('DD/MM/YYYY HH:mm:ss')}</Th>
          </Tr>
          <Tr>
            <Th>POW</Th>
            <Th>{block.pow}</Th>
          </Tr>
        </Tbody>
      </Table>

      <span>Transactions:</span>

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
          {block.transactions.map(tx => (
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
  )
}

export default BlockPage
