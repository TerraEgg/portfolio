import { useEffect, useRef } from 'react'

export default function PerthClock() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackersRef = useRef<Record<string, any>>({})

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ''
    trackersRef.current = {}

    
    const createTracker = (label: string, value: number | string) => {
      const el = document.createElement('span')
      el.className = 'flip-clock__piece'

      const card = document.createElement('b')
      card.className = 'flip-clock__card card'

      const top = document.createElement('b')
      top.className = 'card__top'

      const bottom = document.createElement('b')
      bottom.className = 'card__bottom'

      const back = document.createElement('b')
      back.className = 'card__back'

      const backBottom = document.createElement('b')
      backBottom.className = 'card__bottom'

      card.appendChild(top)
      card.appendChild(bottom)
      back.appendChild(backBottom)
      card.appendChild(back)

      el.appendChild(card)
      if (label) {
        const slot = document.createElement('span')
        slot.className = 'flip-clock__slot'
        slot.innerText = label
        el.appendChild(slot)
      }

      let currentValue: any = -1

      const update = (val: number | string) => {
        const isString = typeof val === 'string'
        const valStr = isString ? val : ('0' + val).slice(-2)
        const padded = isString ? val : ('0' + val).slice(-2)

        if (padded !== String(currentValue)) {
          if (currentValue >= 0 || (isString && currentValue !== -1)) {
            back.setAttribute('data-value', String(currentValue))
            bottom.setAttribute('data-value', String(currentValue))
          }
          currentValue = valStr

          top.innerText = padded
          backBottom.setAttribute('data-value', padded)

          el.classList.remove('flip')
          void el.offsetWidth
          el.classList.add('flip')
        }
      }

      update(value)
      return { el, update }
    }

    
    const getPerthTime = () => {
      const date = new Date()
      const perthTime = new Date(date.toLocaleString('en-US', { timeZone: 'Australia/Perth' }))
      const hours24 = perthTime.getHours()
      const hours12 = hours24 % 12 || 12
      const ampm = hours24 >= 12 ? 'PM' : 'AM'

      return {
        Hours: hours12,
        Minutes: perthTime.getMinutes(),
        Seconds: perthTime.getSeconds(),
        AMPM: ampm
      }
    }

    
    const t = getPerthTime()
    trackersRef.current.Hours = createTracker('', t.Hours)
    trackersRef.current.Minutes = createTracker('', t.Minutes)
    trackersRef.current.Seconds = createTracker('', t.Seconds)
    trackersRef.current.AMPM = createTracker('', t.AMPM)

    container.appendChild(trackersRef.current.Hours.el)
    container.appendChild(trackersRef.current.Minutes.el)
    container.appendChild(trackersRef.current.Seconds.el)
    container.appendChild(trackersRef.current.AMPM.el)

    let frameCount = 0
    const animId = requestAnimationFrame(function updateClock() {
      
      if (frameCount++ % 10 === 0) {
        const time = getPerthTime()
        trackersRef.current.Hours.update(time.Hours)
        trackersRef.current.Minutes.update(time.Minutes)
        trackersRef.current.Seconds.update(time.Seconds)
        trackersRef.current.AMPM.update(time.AMPM)
      }
      requestAnimationFrame(updateClock)
    })

    return () => cancelAnimationFrame(animId)
  }, [])

  return <div ref={containerRef} className="flip-clock"></div>
}


