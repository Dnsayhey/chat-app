import { ComponentPropsWithoutRef } from 'react'
import { IconType } from 'react-icons'
import clsx from 'clsx'

type ButtonProps = {
  icon?: IconType
  variant?: 'default' | 'outline' | 'text' | 'primary'
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
        'inline-flex items-center min-w-[38px] min-h-[38px] rounded px-3 py-1.5 transition-colors',
        {
          'text-black bg-gray-50 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-900':
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
        {
          'bg-primary-500 text-white hover:bg-primary-600 hover:text-white shadow-sm disabled:shadow-none disabled:bg-transparent disabled:text-gray-300 dark:disabled:text-gray-600':
            variant === 'primary',
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
