'use client'

import { useAppContext } from '../components/AppContext'
import Navigation from '@/components/home/Navigation/index'
import Main from '@/components/home/Main/index'

export default function Home() {
  const {
    state: { themeMode },
  } = useAppContext()

  return (
    <div className={`${themeMode} h-full flex`}>
      <Navigation />
      <Main />
    </div>
  )
}
