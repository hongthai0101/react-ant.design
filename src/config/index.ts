
const { VITE_HTTP_BASE, VITE_DEV, VITE_HTTP_BASE_UPLOAD, VITE_UPLOAD_API_KEY } = import.meta.env
const PROD = VITE_DEV === 'false'
const isDevelopment = !PROD

const CONFIG = {
  isProduction: PROD,
  isDevelopment,
  baseURL: '/',
  title: 'Tomato',
  http: {
    baseURL: VITE_HTTP_BASE as string
  },
  github: {
    clientId: PROD ? '789d87c19dd5ed1dc42e' : '489b39e1f91d934128c8',
    callbackURL: `${PROD ? 'https://github.com/hongthai0101' : window.location.origin}/api/passport/github/callback`,
    repositoryUrl: 'https://github.com/hongthai0101/react-ant.design',
    bug: 'https://github.com/hongthai0101'
  },
  upload: {
    url: VITE_HTTP_BASE_UPLOAD ?? '',
    apiKey: VITE_UPLOAD_API_KEY ?? ''
  }
}

export default CONFIG
