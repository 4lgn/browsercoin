import { Button, Flex, Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { genNewWallet } from '../blockchainUtils'
import {
  addWallet,
  getAllWallets,
  getChosenWallet,
  updateChosenWallet,
} from '../redux/flows/wallet'
import WalletContainer from '../WalletContainer'

interface WalletModuleProps {}

const WalletModule: React.FC<WalletModuleProps> = () => {
  const wallets = useSelector(getAllWallets)
  const chosenWallet = useSelector(getChosenWallet)
  const dispatch = useDispatch()

  return (
    <Flex direction="column">
      <Flex>
        <Button
          onClick={() => {
            const newWallet = { bal: 0, keys: genNewWallet() }
            dispatch(addWallet(newWallet))
          }}
        >
          Create new wallet
        </Button>
        <Select
          value={chosenWallet?.keys.pk || ''}
          onChange={e => {
            const choice = e.target.value

            const selectedWallet = wallets.find(
              wallet => wallet.keys.pk === choice
            )

            if (selectedWallet) {
              dispatch(updateChosenWallet(selectedWallet))
            } else {
              alert('Invalid wallet')
            }
          }}
          placeholder="Select wallet"
        >
          {wallets.map(wallet => (
            <option key={wallet.keys.pk} value={wallet.keys.pk}>
              {wallet.keys.pk}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex>Balance: 200</Flex>
    </Flex>
  )
}

export default WalletModule
