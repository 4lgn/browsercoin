import { BlockchainState } from './flows/blockchain'
import { WalletState } from './flows/wallet'
import { PendingTransactionsState } from './flows/pendingTransactions'
import { PeerNodeState } from './flows/peerNode'
import { WorkerState } from './flows/workerState'

export interface RootState {
  blockchain: BlockchainState
  wallet: WalletState
  pendingTransactions: PendingTransactionsState
  peerNode: PeerNodeState
  workerState: WorkerState
}
