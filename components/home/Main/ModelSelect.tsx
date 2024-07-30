import { PiLightningFill, PiShootingStarFill } from 'react-icons/pi'
import { useAppContext } from '@/components/AppContext'
import { ActionType } from '@/reducers/AppReducers'

export default function ModelSelect() {
  const models = [
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5',
      icon: PiLightningFill,
    },
    {
      id: 'gpt-4.0',
      name: 'GPT-4',
      icon: PiShootingStarFill,
    },
  ]

  const {
    state: { selectedModel },
    dispatch,
  } = useAppContext()

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
      {models.map((item) => {
        const selected = selectedModel === item.id
        return (
          <button
            key={item.id}
            className={`flex justify-center items-center space-x-2 py-2.5 min-w-[148px] text-sm font-medium border rounded-lg 
              ${
                selected
                  ? 'border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
                  : 'border-transparent text-gray-500'
              }`}
            onClick={() => {
              dispatch({
                type: ActionType.UPDATE,
                field: 'selectedModel',
                value: item.id,
              })
            }}
          >
            <span>
              <item.icon />
            </span>
            <span>{item.name}</span>
          </button>
        )
      })}
    </div>
  )
}
