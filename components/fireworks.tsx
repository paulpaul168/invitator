'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  delay: number
}

interface Firework {
  id: number
  x: number
  y: number
  color: string
  particles: Particle[]
}

const COLORS = [
  '#ff6b6b', // red
  '#ffd93d', // gold
  '#6bcb77', // green
  '#4d96ff', // blue
  '#ff6bd6', // pink
  '#ffa94d', // orange
  '#a855f7', // purple
  '#22d3ee', // cyan
]

export default function Fireworks() {
  const [fireworks, setFireworks] = useState<Firework[]>([])

  useEffect(() => {
    const createFirework = () => {
      const id = Date.now() + Math.random()
      const x = 10 + Math.random() * 80 // 10-90% of screen width
      const y = 10 + Math.random() * 50 // 10-60% of screen height
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      
      // Create particles for the burst
      const particles: Particle[] = []
      const particleCount = 12 + Math.floor(Math.random() * 8)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: i,
          x: x,
          y: y,
          color: Math.random() > 0.3 ? color : COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.1,
        })
      }

      const firework: Firework = { id, x, y, color, particles }
      
      setFireworks(prev => [...prev, firework])
      
      // Remove firework after animation completes
      setTimeout(() => {
        setFireworks(prev => prev.filter(f => f.id !== id))
      }, 2000)
    }

    // Create initial fireworks
    setTimeout(createFirework, 500)
    setTimeout(createFirework, 1200)
    setTimeout(createFirework, 2000)

    // Create new fireworks periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        createFirework()
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fireworks-container">
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="firework"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {firework.particles.map((particle, index) => (
            <div
              key={particle.id}
              className="firework-particle"
              style={{
                '--particle-color': particle.color,
                '--angle': `${(360 / firework.particles.length) * index}deg`,
                '--delay': `${particle.delay}s`,
              } as React.CSSProperties}
            />
          ))}
          <div 
            className="firework-glow"
            style={{ '--glow-color': firework.color } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  )
}

