import Flow from 'redux-flow'
import { Action } from 'redux'
import { RootState } from '../types'
import { Block, Transaction } from '../../types'

export type PendingTransactionsState = {
  transactions: Transaction[]
}

const initialState: PendingTransactionsState = {
  transactions: [],
}

const { reducer, actions } = Flow('pendingTransactions', {
  initialState: { ...initialState },
  mutations: {
    setPendingTransactions(state, transactions: Transaction[]) {
      state.transactions = transactions
    },
    addPendingTransaction(state, tx: Transaction) {
      state.transactions.push(tx)
    },
  },
  actions: {},
})

export const { getPendingTransactions } = {
  getPendingTransactions(state: RootState) {
    return state.pendingTransactions
  },
}

export const {
  addPendingTransaction,
  setPendingTransactions,
}: {
  addPendingTransaction: (tx: Transaction) => Action
  setPendingTransactions: (transactions: Transaction[]) => Action
} = actions as any

export { reducer }
