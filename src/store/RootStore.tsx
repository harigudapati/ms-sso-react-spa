import { FileUploadStore } from './FileUploadStore.tsx'
import { HelpSupportStore } from './HelpSupportStore.tsx'

export class RootStore {
  fileUploadStore: FileUploadStore
  helpSupportStore: HelpSupportStore
  constructor() {
    this.fileUploadStore = new FileUploadStore(this)
    this.helpSupportStore = new HelpSupportStore(this)
  }
}
