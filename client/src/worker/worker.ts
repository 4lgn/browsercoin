import { Block } from '../types'
import { hash, powIsAcceptable } from '../blockchainUtils'

let cancel = false
let working = false

export async function mine_WORKER(block: Block) {
  working = true
  block.pow = 0
  while (true) {
    // js is single-threaded, so every 1k iterations we use a timeout of 0ms
    // just to give a sliver of control back to the event loop to allow for
    // picking up the updated "cancel" variable, for example. I.e. yield control
    // every 1k iterations.
    if (block.pow % 1000 === 0) await new Promise(r => setTimeout(r, 0))
    if (cancel) {
      cancel = false
      working = false
      return null
    }
    block.pow++
    const blockHash = hash(block)
    if (powIsAcceptable(blockHash)) {
      block.hash = blockHash
      working = false
      return block
    }
  }
}

export function cancel_mining() {
  if (working) cancel = true
  // TODO: Maybe make this use of 0ms timeouts in a loop to repeatedly check if
  // cancel is set to false again... We can then return something to make this
  // function properly awaitable to ensure the job has been cancelled (might be
  // relevant if iteration yield is bumped up to over 1k)
}

export function status() {
  return working ? 'alive' : 'stopped'
}
