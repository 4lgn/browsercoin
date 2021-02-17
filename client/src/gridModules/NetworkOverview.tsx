import {
  Button,
  Flex,
  Heading,
  Link,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { getPeerNeighbours, getPeerStatus } from '../redux/flows/peerNode'

const PeerStatusText: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'connecting':
      return <Text color="orange">Connecting...</Text>
    case 'disconnected':
      return <Text color="red">Disconnected</Text>
    case 'connected':
      return <Text color="green">Connected</Text>
    default:
      return <Text color="red">Connecting...</Text>
  }
}

interface NetworkOverviewProps {}

const NetworkOverview: React.FC<NetworkOverviewProps> = () => {
  const peerStatus = useSelector(getPeerStatus)
  const peerNeighbours = useSelector(getPeerNeighbours)

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Peer status</Th>
          <Th>Peers connected</Th>
          <Th>Hash rate</Th>
          <Th>Transactions/second</Th>
          <Th>Transaction volume (24h)</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Th>
            <PeerStatusText status={peerStatus} />
          </Th>
          <Th>{peerNeighbours.length}</Th>
          <Th>169 EH/s</Th>
          <Th>374</Th>
          <Th>1.4m BTC</Th>
        </Tr>
      </Tbody>
    </Table>
  )
}

export default NetworkOverview
