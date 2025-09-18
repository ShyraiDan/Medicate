'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useGetSingleAnalysisQuery } from '@/client/analysis'
import { AnalysisForm } from '@/components/forms/AnalysisForm/AnalysisForm'
import { PageHeading } from '@/components/PageHeading/PageHeading'
import { Container, LoadingContainer } from '@/components/ui/container'

const EditAnalysisPage = () => {
  const t = useTranslations('page')

  const params = useParams<{ analysisId: string }>()
  const { analysisId } = params
  const { data: session } = useSession()

  const { data: analysis, isLoading } = useGetSingleAnalysisQuery(session?.user.id || '', analysisId)

  return (
    <>
      <PageHeading title={t('editAnalysisPage.title')} />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <Container>
          <AnalysisForm analysis={analysis} />
        </Container>
      )}
    </>
  )
}

export default EditAnalysisPage
