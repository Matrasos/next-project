import { Inter } from 'next/font/google'
import './../../globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['cyrillic'] })

export const metadata = {
  title: 'Todo App',
  description: 'Todo app like pet-project',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
