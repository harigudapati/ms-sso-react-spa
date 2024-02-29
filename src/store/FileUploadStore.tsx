import { action, computed, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export class FileUploadStore {
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      listFile: observable,
      saveFiles: action,
      clearFiles: action,
      removeFileFromList: action,
      countFiles: computed,
    })
  }

  public listFile: File[] = []

  saveFiles = (files_accepted: File[]) => {
    const jointArr = this.listFile.concat(files_accepted)
    //checking for duplicate file
    let uniqueFileList = jointArr.filter(
      (value, index, self) =>
        self.findIndex((m) => m.name === value.name) === index
    )
    this.listFile = uniqueFileList
  }

  removeFileFromList = (file_removed: File) => {
    const currentList = this.listFile
    currentList.splice(currentList.indexOf(file_removed), 1)
    this.listFile = currentList
  }

  clearFiles = () => {
    this.listFile = []
  }

  get countFiles() {
    return this.listFile.length
  }
}
