'use client'
import Image from 'next/image'

import { useMenu } from '@/context/menu-context'

import { Button } from './ui/button'

export default function CollapseMenuButton() {
  const { isOpen, setOpen } = useMenu()
  return (
    <Button
      size="icon"
      className={`bg-muted hover:bg-muted/60`}
      onClick={() => setOpen(!isOpen)}
    >
      <Image src="./menu-left.svg" alt="collapse" width={16} height={16} />
    </Button>
  )
}
