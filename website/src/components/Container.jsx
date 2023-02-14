import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx('mx-auto max-w-7xl px-4 md:px-0 ', className)}
      {...props}
    />
  )
}
