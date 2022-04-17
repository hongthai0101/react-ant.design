import React from 'react'
import './style.scss'
import Footer from '@/components/footer'

export default function (props: any) {
  return (
    <section className="login-page">
      {props.children}
      <Footer />
    </section>
  )
}
