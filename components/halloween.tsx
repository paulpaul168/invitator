'use client'

interface Pumpkin {
  size: number
  delay: number
  variant: 'sprite' | 'gif'
}

const PUMPKIN_LAYOUT: Pumpkin[] = [
  { size: 72, delay: 0, variant: 'sprite' },
  { size: 56, delay: 0.3, variant: 'gif' },
  { size: 68, delay: 0.15, variant: 'sprite' },
  { size: 52, delay: 0.45, variant: 'gif' },
  { size: 64, delay: 0.2, variant: 'sprite' },
]

export default function Halloween() {
  return (
    <div className="halloween-container" aria-hidden="true">
      <div className="halloween-pumpkins">
        {PUMPKIN_LAYOUT.map((pumpkin, index) => (
          <div
            key={index}
            className="halloween-pumpkin"
            style={{
              ['--pumpkin-size' as string]: `${pumpkin.size}px`,
              animationDelay: `${pumpkin.delay}s`,
              ['--flicker-delay' as string]: `${pumpkin.delay}s`,
            }}
          >
            {pumpkin.variant === 'sprite' ? (
              <div className="halloween-pumpkin-sprite">
                <div className="halloween-pumpkin-sprite-strip" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/halloween/plumpkin.gif"
                alt=""
                className="halloween-pumpkin-gif"
                draggable={false}
              />
            )}
            <div className="halloween-pumpkin-glow" />
          </div>
        ))}
      </div>
    </div>
  )
}
