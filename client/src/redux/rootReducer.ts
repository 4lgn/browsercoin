import { combineReducers } from 'redux'
import * as blockchain from './flows/blockchain'
import * as wallet from './flows/wallet'
import * as pendingTransactions from './flows/pendingTransactions'
import * as peerNode from './flows/peerNode'
import * as worker from './flows/workerState'

export default combineReducers({
  blockchain: blockchain.reducer,
  wallet: wallet.reducer,
  pendingTransactions: pendingTransactions.reducer,
  peerNode: peerNode.reducer,
  workerState: worker.reducer,
})
