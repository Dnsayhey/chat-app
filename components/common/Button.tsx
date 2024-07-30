import { ComponentPropsWithoutRef } from 'react'
import { IconType } from 'react-icons'
import clsx from 'clsx'

type ButtonProps = {
  icon?: IconType
  variant?: 'default' | 'outline' | 'text'
} & ComponentPropsWithoutRef<'button'>

export default function Button({
  children,
  className = '',
  icon: Icon,
  variant = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center min-w-[38px] min-h-[38px] rounded px-3 py-1.5',
        {
          'text-black bg-gary-50 hover:bg-gray-200 dark:text-gary-300 dark:bg-gary-700 dark:hover:bg-gary-900':
            variant === 'default',
        },
        {
          'border boder-gray-300 text-black bg-gray-50 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700':
            variant === 'outline',
        },
        {
          'text-black bg-transparent hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700':
            variant === 'text',
        },
        `${className}`,
      )}
      {...props}
    >
      {Icon && <Icon className={`text-lg ${children ? 'mr-1' : ''}`} />}
      {children}
    </button>
  )
}
