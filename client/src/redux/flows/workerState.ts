import Flow from 'redux-flow'
import { Action } from 'redux'
import { RootState } from '../types'
import Worker from '../../worker'

export type WorkerState = {
  worker: Worker | null
}

const initialState: WorkerState = {
  worker: null,
}

const { reducer, actions } = Flow('workerState', {
  initialState: { ...initialState },
  mutations: {
    setWorker(state, worker: Worker) {
      state.worker = worker
    },
    // initializePeer(state) {

    // }
  },
  actions: {},
})

export const { getWorker } = {
  getWorker(state: RootState) {
    return state.workerState.worker
  },
}

export const {
  setWorker,
}: {
  setWorker: (worker: Worker) => Action
} = actions as any

export { reducer }
