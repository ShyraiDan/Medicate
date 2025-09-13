import { EventApi } from '@fullcalendar/core'
import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'

import { H6, P } from '@/components/ui/typography'
import { SupportedLocales } from '@/shared/types'
import { dateLocaleMap } from '@/utils/dateLocaleMap'

interface CalendarAppointmentCardProps {
  event: EventApi
  locale: SupportedLocales
}

const CalendarAppointmentCard = ({ locale, event }: CalendarAppointmentCardProps) => {
  const dateLocale = dateLocaleMap[locale] ?? enUS

  return (
    <Link href={`/appointments/${event.id}`}>
      <div className='flex shadow-custom-right bg-white'>
        <div className='w-2 bg-orange-400' />
        <div className='py-4 pr-4 pl-3 flex flex-col'>
          <H6>{event.title}.</H6>
          <P className='capitalize'>
            {format(parseISO((event?.start ? event.start : new Date())?.toISOString()), 'MMM dd, yyyy HH:mm', {
              locale: dateLocale
            })}
            -
            {format(parseISO((event?.end ? event.end : new Date())?.toISOString()), 'MMM dd, yyyy HH:mm', {
              locale: dateLocale
            })}
          </P>
        </div>
      </div>
    </Link>
  )
}
export default CalendarAppointmentCard
