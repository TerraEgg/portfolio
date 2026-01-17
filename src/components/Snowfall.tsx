import { useMemo } from 'react'
import SnowfallComponent from 'react-snowfall'

export default function Snowfall() {
  
  const showSnow = useMemo(() => {
    const today = new Date()
    return (
      (today.getMonth() === 11) ||
      (today.getMonth() === 0 && today.getDate() <= 20)
    )
  }, [])

  if (!showSnow) return null

  return (
    <SnowfallComponent
      style={{ zIndex: 1000, pointerEvents: 'none' }}
      snowflakeCount={200}
    />
  )
}
