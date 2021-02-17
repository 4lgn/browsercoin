import React from 'react'
import { Block } from './types'

interface BlockchainViewProps {
  blockchain: Block[]
}

const BlockchainView: React.FC<BlockchainViewProps> = ({ blockchain }) => {
  return (
    <div>
      {blockchain.map(block => (
        <div>{block.hash}</div>
      ))}
    </div>
  )
}

export default BlockchainView
