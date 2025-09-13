import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { H6, P } from '@/components/ui/typography'
import { Appointment, SupportedLocales } from '@/shared/types'
import { dateLocaleMap } from '@/utils/dateLocaleMap'

interface AppointmentInfoModalProps {
  appointment: Appointment
  open: boolean
  handleClose: () => void
}

export const AppointmentInfoModal = ({ handleClose, appointment, open }: AppointmentInfoModalProps) => {
  const t = useTranslations('page')
  const { locale } = useParams()

  const dateLocale = dateLocaleMap[locale as SupportedLocales] ?? enUS

  const handleOpenChange = () => {
    if (open) {
      handleClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => handleOpenChange()}>
      <DialogContent className='border-none'>
        <div className='flex flex-col w-full '>
          <H6>{appointment.patient.userName}</H6>
          <P className='capitalize'>
            {format(parseISO(appointment.startTime), 'MMM dd, yyyy HH:mm', { locale: dateLocale })} -{' '}
            {format(parseISO(appointment.endTime), 'MMM dd, yyyy HH:mm', { locale: dateLocale })}
          </P>
          <div className='my-2'>
            <H6>{t('profile.doctor.appointmentReason')}</H6>
            <P>{appointment.reason || '-'}</P>
          </div>
          <div className='mb-2'>
            <H6>{t('profile.doctor.appointmentDetails')}</H6>
            <P>{appointment.description || '-'}</P>
          </div>

          <div className='mt-4 flex'>
            <Link
              href={`/appointments/${appointment._id}`}
              className='text-white bg-blue-100 px-2.5 py-1.5 rounded block'>
              {t('profile.doctor.moveToVisit')}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
