import React from 'react'
import './style.scss'
import CONFIG from '@/config'

const currentYear = new Date().getFullYear()

export default () => {
  return (
    <footer className="global-footer">
      <div>
        Copyright &copy; 2019-{currentYear} {CONFIG.title} -
        <a href="https://github.com/hongthai0101" target="_blank" rel="noopener noreferrer">ThaiLe</a>
      </div>
    </footer>
  )
}
