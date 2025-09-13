'use client'

import { isAfter, isBefore, parseISO } from 'date-fns'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { DoctorAppointmentCard } from '@/components/DoctorAppointmentCard/DoctorAppointmentCard'
import { SkeletonText } from '@/components/skeletons/SkeletonText'
import { H6, P } from '@/components/ui/typography'
import { mockedAppointment } from '@/mocks/mockedAppointment'
import { SupportedLocales } from '@/shared/types'

export const DoctorAppointmentTab = () => {
  const params = useParams()
  const { locale } = params

  const t = useTranslations('page')

  const appointments = mockedAppointment
  const isLoading = false

  const futureAppointments = useMemo(
    () => appointments?.filter((appointment) => isAfter(parseISO(appointment.endTime), new Date())) || [],
    [appointments]
  )

  const pastAppointments = useMemo(
    () => appointments?.filter((appointment) => isBefore(parseISO(appointment.endTime), new Date())) || [],
    [appointments]
  )

  return (
    <>
      {futureAppointments.length === 0 && pastAppointments.length === 0 && !isLoading && (
        <P>{t('profile.patient.noAppointments')}</P>
      )}

      {isLoading && (
        <div className='grid grid-cols-1 gap-4 mt-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonText className='w-full h-[84px]' key={index} />
          ))}
        </div>
      )}

      {futureAppointments.length > 0 && (
        <div className='mt-6'>
          <H6>{t('profile.patient.appointments')}</H6>

          {futureAppointments.length > 0 && (
            <div className='grid grid-cols-1 gap-4 mt-4'>
              {futureAppointments.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  isIncoming
                  locale={locale as SupportedLocales}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div className='mt-6'>
          <H6>{t('profile.patient.historyAppointments')}</H6>

          {pastAppointments.length > 0 && (
            <div className='grid grid-cols-1 gap-4 mt-4'>
              {pastAppointments.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  locale={locale as SupportedLocales}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
