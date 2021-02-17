import Flow from 'redux-flow'
import { Action } from 'redux'
import { RootState } from '../types'
import { Wallet } from '../../types'

export type WalletState = {
  chosenWallet: Wallet | null
  allWallets: {
    [pk: string]: Wallet
  }
}

const initialState: WalletState = {
  chosenWallet: null,
  allWallets: {},
}

const { reducer, actions } = Flow('wallet', {
  initialState: { ...initialState },
  mutations: {
    addWallet(state, wallet: Wallet) {
      state.allWallets[wallet.keys.pk] = { ...wallet }
      state.chosenWallet = { ...wallet }
    },
    updateChosenWallet(state, wallet: Wallet) {
      state.chosenWallet = { ...wallet }
      // Add to all wallets as well
      if (!state.allWallets[wallet.keys.pk]) {
        state.allWallets[wallet.keys.pk] = { ...wallet }
      }
    },
    updateChosenWalletBal(state, bal: number) {
      // Apparently if updateWalletBal is called with bal = 0, it might be
      // undefined, so in that case we set it to the proper number. I reckon
      // this is due to shoddy implmentation of redux-flow :)
      if (state.chosenWallet) {
        state.chosenWallet.bal = bal || 0
      }
    },
  },
  actions: {},
})

export const { getAllWallets, getChosenWallet } = {
  getAllWallets(state: RootState) {
    return Object.values(state.wallet.allWallets)
  },
  getChosenWallet(state: RootState) {
    return state.wallet.chosenWallet
  },
}

export const {
  addWallet,
  updateChosenWallet,
  updateChosenWalletBal,
}: {
  addWallet: (wallet: Wallet) => Action
  updateChosenWallet: (wallet: Wallet) => Action
  updateChosenWalletBal: (bal: number) => Action
} = actions as any

export { reducer }
