import { Button } from '@chakra-ui/react'
import Peer from 'peerjs'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createAndSignTx,
  getBalanceOfWallet,
  txIsOverSpent,
  verifyTxSig,
} from './blockchainUtils'
import { broadcast } from './p2pUtils'
import { getBlockchain } from './redux/flows/blockchain'
import { getPeer } from './redux/flows/peerNode'
import { getChosenWallet, updateChosenWalletBal } from './redux/flows/wallet'

interface WalletContainer {}

const WalletContainer: React.FC<WalletContainer> = ({}) => {
  const dispatch = useDispatch()
  const blockchain = useSelector(getBlockchain)
  const wallet = useSelector(getChosenWallet)
  const peer = useSelector(getPeer)

  useEffect(() => {
    if (wallet) {
      dispatch(
        updateChosenWalletBal(getBalanceOfWallet(wallet.keys.pk, blockchain))
      )
    }
  }, [blockchain])

  if (!wallet) {
    return <div>No wallet chosen!</div>
  }

  return (
    <div>
      <div>
        <Button
          onClick={() => {
            const to = window.prompt('To address:')
            const amount = window.prompt('Amount:')
            if (to && amount) {
              const amountNumber = parseInt(amount)
              if (!isNaN(amountNumber)) {
                const tx = createAndSignTx(wallet.keys, to, amountNumber)
                if (txIsOverSpent(tx, blockchain)) {
                  window.alert('Insufficient funds!')
                  return
                }
                if (peer) {
                  broadcast(peer, { type: 'tx', payload: tx })
                } else {
                  console.error('No peer connected!! :(')
                }
              }
            }
          }}
        >
          Transfer funds
        </Button>
        <Button
          onClick={() => {
            dispatch(
              updateChosenWalletBal(
                getBalanceOfWallet(wallet.keys.pk, blockchain)
              )
            )
          }}
        >
          Update balance
        </Button>
      </div>
      <div>
        <div>Balance: {wallet.bal}</div>

        <div>pk: {wallet.keys.pk}</div>
        <div>sk: {wallet.keys.sk}</div>
      </div>
    </div>
  )
}

export default WalletContainer
