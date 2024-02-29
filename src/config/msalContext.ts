import {
  AccountInfo,
  AuthenticationResult,
  EndSessionRequest,
  EventType,
  InteractionRequiredAuthError,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser'

const getReplyUrl = () => {
  let url = new URL(window.location.href)
  return url.protocol + '//' + url.host + '/'
}

class MsalContext {
  private msalInstance: PublicClientApplication | any
  public account: AccountInfo
  private redirectTokenRequest: RedirectRequest
  private redirectGraphRequest: RedirectRequest
  private silentTokenRequest: SilentRequest
  private silentGraphRequest: SilentRequest

  msalConfig = {
    auth: {
      clientId: '',
      authority:
        'https://login.microsoftonline.com/harikrishnagudapati1gmail.onmicrosoft.com',
      scopes: ['User.Read', 'User.Read.All'],
      navigateToLoginRequestUrl: true,
      redirectUri: getReplyUrl(),
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateIncookie: false,
    },
  }

  private applicationConfig = {
    clientId: '',
    scopes: ['User.Read'],
    authority:
      'https://login.microsoftonline.com/harikrishnagudapati1gmail.onmicrosoft.com',
  }

  public async initializeMsal(conf: any) {
    this.msalConfig.auth.clientId = conf.ApplicationId
    this.msalInstance = new PublicClientApplication(this.msalConfig)
    await this.msalInstance.initialize()
    this.setRequestObjects()
    this.applicationConfig.clientId = conf.ApplicationId
  }

  private setRequestObjects(): void {
    this.redirectTokenRequest = {
      scopes: [this.applicationConfig.clientId],
      redirectStartPage: window.location.href,
    }

    this.redirectGraphRequest = {
      scopes: this.applicationConfig.scopes,
      redirectStartPage: window.location.href,
    }

    this.silentTokenRequest = {
      scopes: this.applicationConfig.scopes,
      account: this.account,
      forceRefresh: false,
    }

    this.silentGraphRequest = {
      scopes: this.applicationConfig.scopes,
      account: this.account,
      forceRefresh: false,
    }
  }

  get MsalInstance() {
    return this.msalInstance
  }

  private NULL_USER: AccountInfo = {
    environment: '',
    homeAccountId: '',
    tenantId: '',
    username: '',
    localAccountId: '',
  }

  private getAccount(): AccountInfo {
    const currnetAccounts = this.msalInstance.getAllAccounts()
    if (currnetAccounts === null || currnetAccounts.length === 0) {
      console.debug('No accounts logged in')
      return this.NULL_USER
    }
    if (currnetAccounts.length > 1) {
      console.debug(
        'Multiple accounts detected, need to add choose account code'
      )
      return currnetAccounts[0]
    }

    if (currnetAccounts.length === 1) {
      return currnetAccounts[0]
    }

    return this.NULL_USER
  }

  loadAuthModule(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // new code ----
      this.account = this.getAccount()
      this.msalInstance.addEventCallback((event: any) => {
        if (
          event.EventType === EventType.LOGIN_SUCCESS &&
          event.payload.account
        ) {
          const account = event.payload.account
          this.msalInstance.setActiveAccount(account)
        }
      })
      //----

      this.msalInstance
        .handleRedirectPromise()
        .then((response: AuthenticationResult) => {
          // if (response !== null && response.account !== null) {
          //   this.account = response.account
          // } else {
          //   this.account = this.getAccount()
          // }
          // resolve()

          //new code---
          if (!response) {
            this.msalInstance.loginRedirect()
            resolve()
          }
          //----
        })
        .catch((e: any) => {
          console.error(e)
          reject(e)
        })

      // this.msalInstance.addEventCallback((event: any) => {
      //   if (
      //     event.EventType === EventType.LOGIN_SUCCESS &&
      //     event.payload.account
      //   ) {
      //     const account = event.payload.account
      //     this.msalInstance.setActiveAccount(account)
      //   }
      // })
    })
  }

  public login(logincallback: () => void): void {
    if (this.account !== this.NULL_USER) {
      logincallback()
    } else {
      this.msalInstance
        .loginRedirect(this.applicationConfig)
        .catch((e: any) => {
          console.error(e)
        })
    }
  }

  logout(): void {
    const logOutRequest: EndSessionRequest = { account: this.account }
    this.msalInstance.logout(logOutRequest)
  }

  async getTokenOrRedirect(): Promise<any> {
    this.silentTokenRequest.account = this.account
    return this.getTokenSilentOrRedirect(
      this.silentTokenRequest,
      this.redirectTokenRequest
    )
  }

  async getGraphTokenOrRedirect(): Promise<string> {
    this.silentGraphRequest.account = this.account
    return this.getTokenSilentOrRedirect(
      this.silentTokenRequest,
      this.redirectGraphRequest
    )
  }

  private getTokenSilentOrRedirect(
    silentRequest: SilentRequest,
    interactiveRequest: RedirectRequest
  ): Promise<any> {
    return new Promise<any>((resolve, reject): void => {
      if (this.account !== this.NULL_USER) {
        this.msalInstance
          .acquireTokenSilent(silentRequest)
          .then((response: any) => {
            resolve(response)
          })
          .catch((e: any) => {
            if (e instanceof InteractionRequiredAuthError) {
              this.msalInstance
                .acquireTokenSilent(interactiveRequest)
                .then(() => reject())
                .catch((e2: any) => {
                  console.error(e2)
                  return reject(e2)
                })
            } else {
              console.error(e)
              return reject(e)
            }
          })
      } else {
        this.msalInstance
          .acquireTokenRedirect(interactiveRequest)
          .then(() => reject())
          .catch((e2: any) => {
            console.error(e2)
            return reject(e2)
          })
      }
    })
  }
}

const msalContext: MsalContext = new MsalContext()
export default msalContext
