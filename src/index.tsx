import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import msalContext from './config/msalContext.ts'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import NoAccess from './NoAccess.tsx'
import { RootStoreProvider } from './store/index.tsx'

const container =
  document.getElementById('root') || document.createElement('div')

const root = ReactDOM.createRoot(container)

const conf: any = {
  ApplicationId: process.env.REACT_APP_CLIENT_ID,
  ApplicationURL: process.env.REACT_APP_URL,
  BaseURL: process.env.REACT_APP_BASE_URL,
}

await msalContext.initializeMsal(conf)
msalContext
  .loadAuthModule()
  .then(() => {
    console.log('hello')
    // const msalAccount: any = msalContext.account
    // const msalAccountRoles = msalAccount?.idTokenClaims?.roles
    let roleHasAccess: boolean = true
    // let allowedRoles: string[] = []

    if (roleHasAccess) {
      msalContext.login(loadApp)
    } else {
      msalContext.login(loadNoAccess)
    }
  })
  .catch((e) => {
    if (e instanceof InteractionRequiredAuthError) {
      loadNoAccess()
    } else {
      console.error(e)
      msalContext.logout()
    }
  })

function loadApp() {
  root.render(
    <StrictMode>
      <RootStoreProvider>
        <App />
      </RootStoreProvider>
    </StrictMode>
  )
}

function loadNoAccess() {
  root.render(<NoAccess />)
}
