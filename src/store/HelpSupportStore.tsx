import { makeAutoObservable, runInAction } from 'mobx'
import { FileUploadStore } from './FileUploadStore.tsx'
import { RootStore } from './RootStore.tsx'
import api from '../middleware/api.tsx'

export class HelpSupportStore {
  fileUploadStore: FileUploadStore
  constructor(rootStore: RootStore) {
    this.fileUploadStore = rootStore.fileUploadStore
    makeAutoObservable(this)
  }

  public sendRequest = async (formData: any) => {
    let response: any
    try {
      response = await api.Support.sendSupportRequest(formData)
      runInAction(() => {
        this.fileUploadStore.clearFiles()
      })
    } catch {
      console.log('error')
    } finally {
      //anything to be reset like splash screen
    }
    return response
  }
}
