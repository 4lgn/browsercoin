import React from 'react'
import { useSelector } from 'react-redux'
import MinerPage from '../pages/MinerPage'
import { getChosenWallet } from '../redux/flows/wallet'

interface MinerModuleProps {}

const MinerModule: React.FC<MinerModuleProps> = () => {
  const wallet = useSelector(getChosenWallet)

  if (!wallet) {
    return <div>No wallet chosen</div>
  }

  return <MinerPage />
}

export default MinerModule
