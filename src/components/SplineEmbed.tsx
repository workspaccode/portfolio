'use client'

import React from 'react'

type Props = {
  url?: string | null
  className?: string
  height?: number | string
}

export default function SplineEmbed({ url, className, height = 420 }: Props) {
  if (!url) return null
  return (
    <div className={className} style={{ height }}>
      <iframe
        src={url}
        style={{ width: '100%', height: '100%', border: '0' }}
        allow="autoplay; fullscreen"
        loading="lazy"
        title="3D Scene"
      />
    </div>
  )
}


