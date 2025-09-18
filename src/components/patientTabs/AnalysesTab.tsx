'use client'

import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useGetAnalysisQuery } from '@/client/analysis'
import { AnalysisCard } from '@/components/AnalysisCard/AnalysisCard'
import { SkeletonText } from '@/components/skeletons/SkeletonText'
import { StyledLinkButton } from '@/components/ui/styledLinkButton'
import { P, H6 } from '@/components/ui/typography'
import { SupportedLocales } from '@/shared/types'

export const AnalysesTab = () => {
  const { data: session } = useSession()

  const params = useParams()
  const { locale } = params

  const { data: analyses, isLoading } = useGetAnalysisQuery(session?.user?.id || '')

  const t = useTranslations('page')

  return (
    <>
      <div className='mt-6 flex justify-between'>
        <H6>{t('profile.patient.addAnalyses')}</H6>
        <StyledLinkButton href='/analyses/add' variant='icon' className='p-2.5 bg-[#0674d1]'>
          <Plus fill='#fff' size={16} />
        </StyledLinkButton>
      </div>

      {(!analyses || analyses?.length === 0) && !isLoading && <P>{t('profile.patient.noAnalyses')}</P>}

      {isLoading && (
        <div className='grid grid-cols-1 gap-4 mt-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonText className='w-full h-[84px]' key={index} />
          ))}
        </div>
      )}

      {analyses && analyses?.length > 0 && (
        <div className='mt-6'>
          <H6>{t('profile.patient.analyses')}</H6>

          {analyses.length > 0 && (
            <div className='grid grid-cols-1 gap-4 mt-4'>
              {analyses.map((analysis) => (
                <AnalysisCard key={analysis._id} analysis={analysis} locale={locale as SupportedLocales} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
