import { message } from 'antd'

export function totalPercentage(totalmem: number, freemem: number) {
  return Math.floor((totalmem - freemem) / totalmem * 100)
}

export function fullscreen() {
  try {
    const docElm = document.documentElement as any
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen()
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen()
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen()
    }
  } catch {
    message.warn('The browser you are using does not support full screen')
  }
}

export function exitFullscreen() {
  try {
    const doc = document as any
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen()
    } else if (doc.webkitCancelFullScreen) {
      doc.webkitCancelFullScreen()
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen()
    }
  } catch {
    message.warn('The browser you are using does not support exiting full screen, please press ESC')
  }
}

export function randomCode(num = 4) {
  const CODE = 'qwertyuipasdfghjklxcvbnm13456789'
  let data = ''

  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * CODE.length)
    data += CODE[random]
  }

  return data
}
