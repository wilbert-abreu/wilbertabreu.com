export default function PageTitle({ children }) {
  return (
    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-white sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-white">
      {children}
    </h1>
  )
}
