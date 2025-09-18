'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateAnalysisMutation, useUpdateAnalysisMutation } from '@/client/analysis'
import { AttachmentPreviewModal } from '@/components/modals/AttachmentPreviewModal/AttachmentPreviewModal'
import { StyledDatePicker } from '@/components/StyledDatePicker/StyledDatePicker'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/errorText'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextArea } from '@/components/ui/textarea'
import { P } from '@/components/ui/typography'
import { useRouter } from '@/i18n/navigation'
import { saveFileToBucket } from '@/lib/bucket'
import { analysisFormValuesSchema } from '@/shared/schemas'
import { Analysis, AnalysisFormValues } from '@/shared/types'

interface AnalysisFormProps {
  analysis?: Analysis
}

export const AnalysisForm = ({ analysis }: AnalysisFormProps) => {
  const t = useTranslations('forms')
  const { data: session } = useSession()
  const router = useRouter()

  const isEditMode = !!analysis?._id
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: createAnalysis } = useCreateAnalysisMutation(session?.user?.id || '')
  const { mutateAsync: updateAnalysis } = useUpdateAnalysisMutation(session?.user?.id || '', analysis?._id || '')

  const { control, handleSubmit, watch, setValue } = useForm<AnalysisFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(analysisFormValuesSchema),
    defaultValues: {
      analysisName: analysis?.analysisName || '',
      date: analysis?.date,
      description: analysis?.description || '',
      fileName: analysis?.fileName || ''
    }
  })

  const onSubmit: SubmitHandler<AnalysisFormValues> = async (values) => {
    if (!session?.user.id) return

    if (isEditMode) {
      const editAnalysis: AnalysisFormValues = {
        ...analysis,
        ...values
      }

      const result = await updateAnalysis({
        patientId: session.user.id,
        analysisId: analysis._id,
        data: editAnalysis
      })

      if (result) {
        toast.success(t('notifications.analysisUpdateSuccess'))

        // router.push()
        router.push(`/analyses/${result._id}`)
      } else {
        toast.error(t('notifications.analysisUpdateError'))
      }
    } else {
      const newAnalysis: AnalysisFormValues = {
        ...values
      }

      const result = await createAnalysis({
        patientId: session.user.id,
        data: newAnalysis
      })

      console.log('result', result)

      if (result._id) {
        toast.success(t('notifications.analysisCreateSuccess'))

        router.push(`/analyses/${result._id}`)
      } else {
        toast.error(t('notifications.analysisCreateError'))
      }
    }
  }

  const handleUploadFile = async (file: File) => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()

    const fileName = await saveFileToBucket(file, `analyses_${timestamp}.${extension}`, 'beclinic/custom/files')
    setValue('fileName', fileName)
  }

  const fileName = watch('fileName') ?? ''

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className='mb-4'>
        <Controller
          name='analysisName'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className='mb-4'>
              <Label htmlFor='analysisName'>{t('analysisForm.analysisName.label')}</Label>
              <Input
                id='analysisName'
                type='text'
                placeholder={t('analysisForm.analysisName.placeholder')}
                {...field}
              />
              {error?.message && <ErrorText>{t(error.message)}</ErrorText>}
            </div>
          )}
        />
      </div>

      <div className='mb-4 w-full'>
        <Controller
          name='date'
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <P className='font-medium mb-2'>{t('analysisForm.analysisDate.label')}</P>
              <StyledDatePicker
                initialDate={value}
                hintFormat='dd/MM/yyyy'
                onChange={onChange}
                placeholder={t('analysisForm.analysisDate.placeholder')}
              />
              {error?.message && <ErrorText>{t(error.message)}</ErrorText>}
            </>
          )}
        />
      </div>

      <div className='mb-4 w-full sm:mb-0'>
        <Controller
          name='description'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Label htmlFor='description'>{t('analysisForm.analysisDescription.label')}</Label>
              <TextArea id='description' placeholder={t('analysisForm.analysisDescription.placeholder')} {...field} />
              {error?.message && <ErrorText>{t(error.message)}</ErrorText>}
            </>
          )}
        />
      </div>

      <div className='mt-4 w-full'>
        <Controller
          name='fileName'
          control={control}
          render={({ fieldState: { error } }) => (
            <>
              <Label htmlFor='fileName'>{t('analysisForm.analysisFiles.label')}</Label>
              <div className='flex items-center gap-3'>
                {!fileName && (
                  <Button
                    onClick={() => {
                      fileInputRef.current?.click()
                    }}>
                    {t('analysisForm.analysisFiles.button')}
                  </Button>
                )}

                {fileName ? <AttachmentPreviewModal attachment={fileName} /> : null}

                {fileName && (
                  <Button
                    className='border border-solid border-red bg-transparent text-red'
                    onClick={() => {
                      setValue('fileName', '')
                    }}>
                    {t('cancel')}
                  </Button>
                )}

                {/* TODO: Refactor this void function */}
                <input
                  ref={fileInputRef}
                  type='file'
                  name='file'
                  id='fileName'
                  accept='image/jpg, image/jpeg, image/png, application/pdf'
                  className='hidden'
                  onChange={(e) => void handleUploadFile(e.target.files![0])}
                />
              </div>

              {error?.message && <ErrorText>{t(error.message)}</ErrorText>}
            </>
          )}
        />
      </div>

      <Button className='mt-5 w-full' type='submit'>
        {t('save')}
      </Button>
    </form>
  )
}
