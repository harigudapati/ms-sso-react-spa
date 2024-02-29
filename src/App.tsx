import React from 'react'
import IdleTimer from 'react-idle-timer'
import msalContext from './config/msalContext.ts'

export const App = () => {
  const onIdle = () => {
    msalContext.logout()
    sessionStorage.removeItem('confidentiality')
  }

  return (
    <>
      <IdleTimer
        timeout={1800 * 1000}
        onIdle={onIdle}
        crossTab={true}
      ></IdleTimer>
      <h1>Hello!! Welcome to MS Single sign on app</h1>
    </>
  )
}
