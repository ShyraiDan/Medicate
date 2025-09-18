'use client'

import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Pencil } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useGetSingleAnalysisQuery } from '@/client/analysis'
import { AttachmentPreviewModal } from '@/components/modals/AttachmentPreviewModal/AttachmentPreviewModal'
import { PageHeading } from '@/components/PageHeading/PageHeading'
import { SkeletonText } from '@/components/skeletons/SkeletonText'
import { Container } from '@/components/ui/container'
import { Separator } from '@/components/ui/separator'
import { StyledLinkButton } from '@/components/ui/styledLinkButton'
import { H2, H4, P } from '@/components/ui/typography'
import { dateLocaleMap } from '@/utils/dateLocaleMap'

const SingleAnalysisPage = () => {
  const t = useTranslations('page')
  const { data: session } = useSession()
  const params = useParams<{ locale: string; analysisId: string }>()
  const { locale, analysisId } = params

  const { data: analyses, isLoading } = useGetSingleAnalysisQuery(session?.user.id || '', analysisId)

  const dateLocale = dateLocaleMap[locale] ?? enUS

  if (!analyses && !isLoading) {
    notFound()
  }

  return (
    <>
      <PageHeading title=''>
        {isLoading ? (
          <SkeletonText className='h-10 mb-2.5 mt-5.5 w-[270px] bg-white opacity-10' />
        ) : (
          <H2 className='text-white mt-4 mb-1'>{analyses?.analysisName}</H2>
        )}

        <div className='flex items-center w-full justify-between'>
          {isLoading || !analyses ? (
            <SkeletonText className='h-4 mb-1 w-[240px] bg-white opacity-10' />
          ) : (
            <P className='text-white'>
              {t('singleAnalysisPage.analysisDate')}{' '}
              <span className='capitalize'>{format(analyses.date, 'MMM dd, yyyy HH:mm', { locale: dateLocale })}</span>
            </P>
          )}

          <div className='flex gap-4 text-white'>
            <StyledLinkButton variant='icon' href={`/analyses/${analyses?._id}/edit`}>
              <Pencil size={16} />
            </StyledLinkButton>
          </div>
        </div>
      </PageHeading>
      <Container className='min-h-[40vh]'>
        <H4 className='mb-2'>{t('singleAnalysisPage.analysisDetails')}</H4>

        {isLoading ? <SkeletonText className='h-4 mb-1 w-[240px]' /> : <P>{analyses?.description || '-'}</P>}

        <Separator className='bg-[#D1D1D1]' />
        {analyses?.fileName && <AttachmentPreviewModal attachment={analyses.fileName} />}
      </Container>
    </>
  )
}

export default SingleAnalysisPage
