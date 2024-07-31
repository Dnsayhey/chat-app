import { Chat } from '@/types/chat'

export function generateChatList(count: number): Chat[] {
  const now = Date.now()
  const titles = [
    'React从入门到放弃实战课程',
    '如何使用Next.js创建React项目',
    '颈椎的护理',
  ]

  const ChatList: Chat[] = []

  for (let i = 0; i < count; i++) {
    // 计算当前索引对应的 id 和 title
    const id = (i + 1).toString()
    const titleIndex = i % titles.length
    const title = titles[titleIndex]

    // 计算更新时间
    // 注意：JavaScript 中的 Date.now() 返回的是毫秒值，所以这里需要计算毫秒数
    const daysAgoInMilliseconds = 3 * 24 * 60 * 60 * 1000 * i
    const updateTime = now - daysAgoInMilliseconds

    // 添加课程到数组
    ChatList.push({ id, title, updateTime })
  }

  return ChatList
}

export function groupByDate(chatList: Chat[]) {
  const groupMap = new Map<string, Chat[]>()
  chatList.forEach((item) => {
    const now = new Date()
    const updateTime = new Date(item.updateTime)
    let key = '未知时间'
    const dayDiff = Math.floor(
      (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (dayDiff === 0 && now.getDate() === updateTime.getDate()) {
      key = '今天'
    } else if (dayDiff <= 7) {
      key = '最近7天'
    } else if (dayDiff <= 31) {
      key = '最近一个月'
    } else if (now.getFullYear() === updateTime.getFullYear()) {
      key = `${updateTime.getMonth() + 1}月`
    } else {
      key = `${updateTime.getFullYear()}`
    }
    if (groupMap.has(key)) {
      groupMap.get(key)?.push(item)
    } else {
      groupMap.set(key, [item])
    }
  })
  groupMap.forEach((item) => {
    item.sort((a, b) => b.updateTime - a.updateTime)
  })
  const groupList = Array.from(groupMap).sort(([, list1], [, list2]) => {
    return (
      list2[list2.length - 1].updateTime - list1[list1.length - 1].updateTime
    )
  })
  return groupList
}

export function sleep(time: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve('time is up')
    }, time),
  )
}
