import ModelSelect from './ModelSelect'
import Example from './Example'

export default function Welcome() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-20">
      <ModelSelect />
      <h1 className="mt-20 text-4xl font-bold">
        免费使用 - DeepSeekChat & DeepSeekCoder
      </h1>
      <Example />
    </div>
  )
}
