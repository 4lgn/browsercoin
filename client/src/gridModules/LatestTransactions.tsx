import React from 'react'
import {
  Button,
  Flex,
  Heading,
  Link,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Transaction } from '../types'

interface LatestTransactionsProps {}

const LatestTransactions: React.FC<LatestTransactionsProps> = () => {
  const pendingTransactions: Transaction[] = []
  return (
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
        {pendingTransactions.map(tx => (
          <Tr>
            <Th>{tx.from}</Th>
            <Th>{tx.to}</Th>
            <Th>{tx.amount}</Th>
            <Th>{tx.timestamp}</Th>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default LatestTransactions
