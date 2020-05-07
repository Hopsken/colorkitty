import React from 'react'
import { PaletteCard } from '@/views/components/palette/palette-card.component'
import { Palette } from '@/types'

const FAKE_PALETTE: any = {
  colors: ['#f35c87', '#20639b', '#3caea3', '#f6d55c', '#ed553b', '#179ad1'],
  created: 1582521938,
  creator: 'kumi',
  liked: false,
  likes: 0,
  name: 'NEW PALETTE',
  paletteId: 510,
  _id: '223' as any,
  isLiked: false,
  createdAt: '',
  updatedAt: '',
}

export const Playground = () => {
  return <PaletteCard palette={FAKE_PALETTE as Palette} />
}
