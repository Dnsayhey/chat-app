import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdCheck, MdClose, MdDeleteOutline } from 'react-icons/md'
import { PiChatBold, PiTrashBold } from 'react-icons/pi'

import { Chat } from '@/types/chat'

type Props = {
  item: Chat
  selected: boolean
  onSelected: (chat: Chat) => void
}

export default function ChatItem({ item, selected, onSelected }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setEditing(false)
  }, [selected])

  return (
    <li
      className={clsx(
        'group flex items-center p-3 space-x-3 cursor-pointer rounded-md hover:bg-gray-800 relative',
        { 'bg-gray-800 pr-[3.5em]': selected },
      )}
      onClick={() => {
        onSelected(item)
      }}
    >
      <div>{deleting ? <PiTrashBold /> : <PiChatBold />}</div>
      {editing ? (
        <input
          type="text"
          className="flex-1 min-w-0 bg-transparent outline-none"
          defaultValue={item.title}
          autoFocus={true}
        />
      ) : (
        <div className="flex-1 whitespace-nowrap overflow-hidden relative">
          {item.title}
          <span
            className={clsx(
              'group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 from-gray-900 bg-gradient-to-l',
              { 'from-gray-800': selected },
            )}
          ></span>
        </div>
      )}
      {selected && (
        <div className="absolute right-1 flex">
          {editing || deleting ? (
            <>
              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  if (editing) {
                    console.log('Item edited.')
                  } else if (deleting) {
                    console.log('Item deleted')
                  }
                  setEditing(false)
                  setDeleting(false)
                  e.stopPropagation()
                }}
              >
                <MdCheck />
              </button>
              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  setEditing(false)
                  setDeleting(false)
                  e.stopPropagation()
                }}
              >
                <MdClose />
              </button>
            </>
          ) : (
            <>
              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  setEditing(true)
                  e.stopPropagation()
                }}
              >
                <AiOutlineEdit />
              </button>
              <button
                className="p-1 hover:text-white"
                onClick={(e) => {
                  setDeleting(true)
                  e.stopPropagation()
                }}
              >
                <MdDeleteOutline />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  )
}
