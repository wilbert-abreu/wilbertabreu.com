export default function SectionContainer({ children, className = '' }) {
  return <div className={`max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0 ${className}`}>{children}</div>
}
