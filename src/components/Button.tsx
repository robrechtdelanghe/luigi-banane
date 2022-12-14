import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{}

export default function Button({children, ...otherProps}: Props) {
  return <button
    className="bg-cyan-900 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mb-5 lg:mb-0 text-xl lg:text-sm min-w-[200px]"
    {...otherProps}
  >
    {children}
  </button>
}