import dynamic from 'next/dynamic'

const SubscribeComponent = dynamic(
  () => import('./component'),
  { ssr: false }
)

export default SubscribeComponent