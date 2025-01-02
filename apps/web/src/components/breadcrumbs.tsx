'use client'

import { usePathname } from 'next/navigation'

import {
  Breadcrumb as B,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { translate } from '@/utils/translate'

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter((segment) => segment !== '')

  return (
    <B>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className={pathname === '/' ? 'pointer-events-none opacity-60' : ''}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1

          return (
            <BreadcrumbItem key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbLink
                href={href}
                className={isLast ? 'pointer-events-none opacity-60' : ''}
                aria-current={isLast ? 'page' : undefined}
              >
                {translate(segment)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </B>
  )
}
