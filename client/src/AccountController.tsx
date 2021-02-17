import React from 'react'
import { Miner, WalletKeys } from './types'
import { genNewWallet } from './blockchainUtils'
import { Button } from '@chakra-ui/react'

interface AccountControllerProps {
  newAccount: (miner: Miner, wallet: WalletKeys) => void
}

const AccountController: React.FC<AccountControllerProps> = ({
  newAccount,
}) => {
  return (
    <div>
      <h2>Controls:</h2>
      <div>
        <Button
          onClick={async () => {
            const wallet = genNewWallet()
            const miner: Miner = {
              address: wallet.pk,
              blockchain: [],
              peerNodes: [],
              pendingTransactions: [],
            }
            newAccount(miner, wallet)
          }}
        >
          New account
        </Button>

        <Button
          onClick={async () => {
            console.log('import')
            // newAccount(miner, wallet)
          }}
        >
          Import account
        </Button>
      </div>
    </div>
  )
}

export default AccountController
