export interface RootStore {
  cache: any
  user: any
  loadingUser: boolean
}

declare module '@/types' {
  interface RootState {
    root: RootStore
  }
}
