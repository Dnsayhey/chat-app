'use client'

import Button from '@/components/common/Button'
import { LuPanelLeft } from 'react-icons/lu'
import { useAppContext } from '@/components/AppContext'
import { ActionType } from '@/reducers/AppReducers'

export default function Menu() {
  const {
    state: { displayNavigation },
    dispatch,
  } = useAppContext()

  return (
    !displayNavigation && (
      <Button
        icon={LuPanelLeft}
        variant="outline"
        onClick={() => {
          dispatch({
            type: ActionType.UPDATE,
            field: 'displayNavigation',
            value: true,
          })
        }}
        className="fixed left-2 top-2"
      />
    )
  )
}
