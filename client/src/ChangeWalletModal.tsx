import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllWallets, getChosenWallet } from './redux/flows/wallet'
import { Wallet } from './types'

interface ChangeWalletModalProps {
  isOpen: boolean
  onClose: (walletPk?: Wallet) => void
}

const ChangeWalletModal: React.FC<ChangeWalletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [walletChoice, setWalletChoice] = useState<string>('')
  const wallets = useSelector(getAllWallets)
  const chosenWallet = useSelector(getChosenWallet)

  useEffect(() => {
    if (chosenWallet) {
      setWalletChoice(chosenWallet.keys.pk)
    }
  }, [chosenWallet])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            value={walletChoice}
            onChange={e => setWalletChoice(e.target.value)}
            placeholder="Select wallet"
          >
            {wallets.map(wallet => (
              <option value={wallet.keys.pk}>{wallet.keys.pk}</option>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => onClose()}>
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              const chosenWallet = wallets.find(
                wallet => wallet.keys.pk === walletChoice
              )
              if (chosenWallet) {
                onClose(chosenWallet)
              } else {
                alert('Invalid wallet')
              }
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ChangeWalletModal
