'use client'

import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

import { HeaderBurger } from '@/components/HeaderBurger/HeaderBurger'
import { AuthModal } from '@/components/modals/AuthModal/AuthModal'
import LanguageModal from '@/components/modals/LanguageModal/LanguageModal'
import { StyledLink } from '@/components/ui/styledLink'
import { UserRoles } from '@/shared/types'
import { cn } from '@/utils/utils'

import type { Session } from 'next-auth'

interface HeaderLinkProps {
  id?: string
  href: string
  label: string
  prefetch?: boolean
}

const links: HeaderLinkProps[] = [
  {
    id: 'header-link-1',
    href: '/doctors',
    label: 'links.doctors'
  },
  {
    id: 'header-link-2',
    href: '/blog',
    label: 'links.blog'
  },
  {
    id: 'header-link-3',
    href: '/contacts',
    label: 'links.contacts'
  },
  {
    id: 'header-link-4',
    href: '/faq',
    label: 'links.faqs'
  }
]

interface HeaderProps {
  session: Session | null
}

const HeaderLink = ({ id, href, label, prefetch, currentPath }: HeaderLinkProps & { currentPath: string }) => {
  const t = useTranslations('header')

  return (
    <li className='p-2.5 flex' key={id}>
      <StyledLink
        prefetch={prefetch}
        href={href}
        className={cn(
          'text-white text-lg hover:text-blue-400 transition-all duration-300 ease-in-out',
          currentPath === href && 'text-blue-400'
        )}>
        {t(label)}
      </StyledLink>
    </li>
  )
}

const HEADER_ANIMATION_HEIGHT = 220
const HEADER_ANIMATION_HEIGHT_HERO = 550

export const Header = ({ session }: HeaderProps) => {
  const path = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isPatient = session?.user?.role === UserRoles.PATIENT

  const threshold = useMemo(() => (path === '/' ? HEADER_ANIMATION_HEIGHT_HERO : HEADER_ANIMATION_HEIGHT), [path])

  const bgRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const tickingRef = useRef(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      requestAnimationFrame(() => {
        const y = window.scrollY
        if (!reduceMotion) {
          const parallaxY = -y * 0.35
          if (bgRef.current) {
            bgRef.current.style.transform = `translate3d(0, ${parallaxY}px, 0)`
          }

          const op = y <= threshold ? Math.min(0.65, (y / threshold) * 0.65) : 0.65
          if (overlayRef.current) {
            overlayRef.current.style.opacity = String(op)
          }
        }

        setScrolled((prev) => (prev !== y > threshold ? y > threshold : prev))

        tickingRef.current = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return (
    <header>
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-[11] bg-[url('/header_bg.jpg')] bg-center bg-no-repeat bg-cover transition-all ease-in-out duration-300 lg:bg-none lg:backdrop-blur",
          scrolled && "lg:!bg-[url('/header_bg.jpg')] bg-center bg-no-repeat bg-cover"
        )}>
        <div className='flex justify-between py-9 px-4 w-full lg:max-w-[1200px] lg:mx-auto'>
          <div className='flex items-center justify-center'>
            <Link href='/'>
              <Image src='/logo.png' alt='beClinic' width={182} height={32} />
            </Link>
          </div>

          <div className='hidden lg:block'>
            <ul className='flex items-center gap-5'>
              {isPatient && (
                <>
                  <HeaderLink
                    href={`/patient/${session.user.id}?tab=appointments`}
                    label='links.appointment'
                    currentPath={path}
                  />
                  <HeaderLink
                    href={`/patient/${session.user.id}?tab=analyzes`}
                    label='links.analyzes'
                    currentPath={path}
                  />
                </>
              )}

              {links.map((link) => (
                <HeaderLink key={link.id} {...link} currentPath={path} />
              ))}
            </ul>
          </div>

          <div className='flex items-center gap-4 ml-4'>
            <div className='ml-2'>
              <LanguageModal />
            </div>
            {session ? (
              <Link href={`/${session.user.role}/${session.user.id}?tab=appointments`}>
                {/* {session.image ? (
                  <Image
                    src={`${BUCKET_URL}/custom/avatars/${session.image}`}
                    alt='user avatar'
                    className='w-10 h-10 rounded-full'
                    width={40}
                    height={40}
                    unoptimized
                  />
                ) : (
                  <div className='w-10 h-10 flex items-center justify-center bg-white rounded-full'>
                    <FaUser className='fill-blue-100' />
                  </div>
                )} */}

                <div className='w-10 h-10 flex items-center justify-center bg-white rounded-full'>
                  <User className='text-blue-100' />
                </div>
              </Link>
            ) : (
              <AuthModal />
            )}

            <div className='lg:hidden'>
              <HeaderBurger session={session} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
