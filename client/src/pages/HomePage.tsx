import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
  Wrap,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import BlockchainProvider from '../BlockchainProvider'
import LatestBlocks from '../gridModules/LatestBlocks'
import LatestTransactions from '../gridModules/LatestTransactions'
import MinerModule from '../gridModules/MinerModule'
import NetworkOverview from '../gridModules/NetworkOverview'
import WalletModule from '../gridModules/WalletModule'
import PeerProvider from '../PeerProvider'

interface HomePageProps {}

const GridBox: React.FC<{ title?: string }> = ({ title, children }) => (
  <Flex width="100%" p={5} shadow="md" borderWidth="1px" direction="column">
    {title && (
      <Heading fontSize="lg" mb="6">
        {title}
      </Heading>
    )}
    {children}
  </Flex>
)

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <PeerProvider>
      <BlockchainProvider>
        <Flex p="50" direction="column">
          <VStack spacing="50">
            <GridBox title="Network overview">
              <NetworkOverview />
            </GridBox>
            <HStack w="100%" spacing="50" align="baseline">
              <GridBox title="Latest blocks">
                <LatestBlocks />
              </GridBox>
              <GridBox title="Latest transactions">
                <LatestTransactions />
              </GridBox>
            </HStack>
            <HStack w="100%" spacing="50" align="baseline">
              <GridBox title="Miner">
                <MinerModule />
              </GridBox>
              <GridBox title="Wallet">
                <WalletModule />
              </GridBox>
            </HStack>
          </VStack>
        </Flex>
      </BlockchainProvider>
    </PeerProvider>
  )

  // return (
  //   <div>
  //     {/* TODO: Blockchain explorer */}
  //     <ChangeWalletModal
  //       isOpen={modalOpen}
  //       onClose={wallet => {
  //         if (wallet) {
  //           dispatch(updateChosenWallet(wallet))
  //         }
  //         setModalOpen(false)
  //       }}
  //     />
  //     <Button
  //       onClick={() => {
  //         history.push('/miner')
  //       }}
  //     >
  //       Start mining
  //     </Button>
  //     <Button
  //       onClick={() => {
  //         const newWallet = { bal: 0, keys: genNewWallet() }
  //         dispatch(addWallet(newWallet))
  //       }}
  //     >
  //       Create new wallet
  //     </Button>
  //     <Button>Import wallet</Button>
  //     <Button onClick={() => setModalOpen(true)}>Change wallet</Button>
  //   </div>
  // )
}

export default HomePage
