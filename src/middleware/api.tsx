import axios, { AxiosResponse } from 'axios'
import msalConfig from '../config/msalContext.ts'

const initialInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

initialInstance.interceptors.request.use(async (config) => {
  return msalConfig.getTokenOrRedirect().then((token) => {
    config.headers['Authorization'] = `bearer ${token.idToken}`
    return config
  })
})

initialInstance.interceptors.response.use(undefined, (error) => {
  logError(error)
})

const logError = (error: any) => {
  if (error.message === 'Network Error' && !error.response) {
    console.error('Network error - make sure API is running!')
  }
  const { status } = error.response

  if (status === 500) {
    console.error('Server error - check the terminal for more info!')
  }
  throw error.response
}

const responseBody = (response: AxiosResponse) => response.data

const requests = {
  get: (url: string) => initialInstance.get(url).then(responseBody),
  post: (url: string, body: {}) =>
    initialInstance.post(url, body).then(responseBody),
  patch: (url: string, body: {}) =>
    initialInstance.patch(url, body).then(responseBody),
  put: (url: string, body: {}) =>
    initialInstance.put(url, body).then(responseBody),
  del: (url: string) => initialInstance.delete(url).then(responseBody),
}

const Support = {
  sendSupportRequest: (supportRequest: any): Promise<any> =>
    requests.post('/example/example', supportRequest),
}

const api = {
  Support,
}

export default api
