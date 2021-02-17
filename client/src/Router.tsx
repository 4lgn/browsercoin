import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import BlockPage from './pages/BlockPage'
import HomePage from './pages/HomePage'
import MinerPage from './pages/MinerPage'
import NotFoundPage from './pages/NotFoundPage'
import WalletPage from './pages/WalletPage'

interface RouterProps {}

const Router: React.FC<RouterProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/wallet">
          <WalletPage />
        </Route>
        <Route path="/miner">
          <MinerPage />
        </Route>
        <Route path="/block/:id">
          <BlockPage />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
