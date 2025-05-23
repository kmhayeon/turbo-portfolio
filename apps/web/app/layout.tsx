import React from 'react'
import './globals.css'
import 'aos/dist/aos.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

export const metadata = {
  title: 'HAYEON',
  description: 'hayeon portfolio',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
