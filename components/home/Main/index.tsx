import Menu from './Menu'
import Welcome from './Welcome'
import ChatInput from './ChatInput'

export default function Main() {
  return (
    <div className="flex-1 relative">
      <main className="flex-1 w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 overflow-y-auto">
        <Menu />
        <Welcome />
        <ChatInput />
      </main>
    </div>
  )
}
