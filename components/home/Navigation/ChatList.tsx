import { generateChatList, groupByDate } from '@/common/utils'
import { Chat } from '@/types/chat'
import clsx from 'clsx'
import { useState, useMemo } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdCheck, MdClose, MdDeleteOutline } from 'react-icons/md'
import { PiChatBold, PiTrashBold } from 'react-icons/pi'

export default function ChatList() {
  const [chatList, setChatList] = useState<Chat[]>(generateChatList(20))

  const [selectedChat, setSelectedChat] = useState<Chat>()
  const groupList = useMemo(() => {
    return groupByDate(chatList)
  }, [chatList])

  return (
    <div className="flex1 mb-[48px] mt-2 flex flex-col overflow-y-auto">
      {groupList.map(([date, list]) => {
        return (
          <div key={date}>
            <div className="sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500">
              {date}
            </div>
            <ul>
              {list.map((item) => {
                const selected = selectedChat?.id === item.id
                return (
                  <li
                    key={item.id}
                    className={clsx(
                      'group flex items-center p-3 space-x-3 cursor-pointer rounded-md hover:bg-gray-800',
                      { 'bg-gray-800': selected },
                    )}
                    onClick={() => {
                      setSelectedChat(item)
                    }}
                  >
                    <div>
                      <PiChatBold />
                    </div>
                    <div className="flex-1 whitespace-nowrap overflow-hidden relative">
                      {item.title}
                      <span
                        className={clsx(
                          'group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 from-gray-900 bg-gradient-to-l',
                          { 'from-gray-800': selected },
                        )}
                      ></span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
