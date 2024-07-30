import { useAppContext } from '@/app/AppContext'
import Button from '@/components/common/Button'
import { ActionType } from '@/reducers/AppReducers'
import { MdLightMode, MdDarkMode, MdInfo } from 'react-icons/md'

export default function Toolbar() {
  const {
    state: { themeMode },
    dispatch,
  } = useAppContext()

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-2 flex justify-between">
      <Button
        icon={themeMode === 'light' ? MdDarkMode : MdLightMode}
        variant="text"
        onClick={() => {
          dispatch({
            type: ActionType.UPDATE,
            field: 'themeMode',
            value: themeMode === 'light' ? 'dark' : 'light',
          })
        }}
      />
      <Button icon={MdInfo} variant="text" />
    </div>
  )
}
