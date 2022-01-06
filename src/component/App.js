import React, { useState } from "react"
import GlobalStyle from "../style/GlobalStyle"
import styled from "styled-components"
import { GlobalContext } from "../contexts"
import Footer from "./Footer"
import { HashRouter as Router, Switch, Route } from "react-router-dom"
import HomePage from "../pages/Homepage"
import RoomPage from "../pages/Roompage"
import RegisterPage from "../pages/Registerpage"
import GamePage from "../pages/Gamepage"

const Root = styled.div``

const App = () => {
  const [user, setUser] = useState()
  const [token, setToken] = useState()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <GlobalContext.Provider
      value={{ user, setUser, token, setToken, isLoading, setIsLoading }}
    >
      <Root>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/rooms">
              <RoomPage />
            </Route>
            <Route path="/infos"></Route>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Route path="/gameroom/:roomId">
              <GamePage />
            </Route>
          </Switch>
        </Router>
        <Footer />
      </Root>
    </GlobalContext.Provider>
  )
}

export default App
