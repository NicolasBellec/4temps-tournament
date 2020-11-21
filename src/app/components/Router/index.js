// @flow
import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Components
import CreateTournament from '../CreateTournament'
import EditTournamentList from '../EditTournamentList'
import EditTournament from '../EditTournament'
import SignUp from '../SignUp'
import Home from '../Home'
import Login from '../Login'
import FourOFour from '../FourOFour'
import RoundOverview from '../RoundOverview'
import PrivateRoute from './private-route'
import Leaderboard from '../Leaderboard'

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
