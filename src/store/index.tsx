import React, { ReactNode, createContext, useContext, useMemo } from 'react'
import { RootStore } from './RootStore.tsx'

let store: RootStore

export const StoreContext = createContext<RootStore | undefined>(undefined)
StoreContext.displayName = 'StoreContext'

export const useRootStore = () => {
  const context = useContext(StoreContext)

  if (context === undefined) {
    throw new Error('useStore must be used within RootStoreProvider')
  }

  return context
}

export const RootStoreProvider = ({ children }: { children: ReactNode }) => {
  const root = useMemo(() => store ?? new RootStore(), [])

  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>
}
