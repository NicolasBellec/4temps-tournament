// @flow
import React from 'react'
import { Switch, Route } from 'react-router-dom'
// $FlowFixMe
import baseLoadable from '@loadable/component'

function loadable(func, config) {
    return baseLoadable(func, {
      fallback: <div>Loading...</div>,
      ...config
    })
}

// Components
import CreateTournament from '../CreateTournament'
import EditTournamentList from '../EditTournamentList'
import EditTournament from '../EditTournament'
import SignUp from '../SignUp'
import Home from '../Home'
import Login from '../Login'
import FourOFour from '../FourOFour'
import RoundOverview from '../RoundOverview'
import Leaderboard from '../Leaderboard'
import PrivateRoute from './private-route'

// const CreateTournament = loadable(() => import('../CreateTournament'))
// const EditTournamentList = loadable(() => import('../EditTournamentList'))
// const EditTournament = loadable(() => import('../EditTournament'))
// const SignUp = loadable(() => import('../SignUp'))
// const Home = loadable(() => import('../Home'))
// const Login = loadable(() => import('../Login'))
// const FourOFour = loadable(() => import('../FourOFour'))
// const RoundOverview = loadable(() => import('../RoundOverview'))
// const Leaderboard = loadable(() => import('../Leaderboard'))


const Router = () => (
  <Switch>
    <Route path="/(|home)" exact component={Home} />
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={Login} />
    <Route path="/leaderboard/:tournamentId" component={Leaderboard} />
    <PrivateRoute path="/tournament/create" exact Component={CreateTournament} />
    <PrivateRoute path="/tournament/edit" exact Component={EditTournamentList} />
    <PrivateRoute path="/tournament/edit/:tournamentId" Component={EditTournament} />
    <PrivateRoute path="/tournament/:tournamentId/round/:roundId" Component={RoundOverview} />
    <Route component={FourOFour} />
  </Switch>
)

export default Router
