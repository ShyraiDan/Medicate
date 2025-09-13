'use client'

import { EventClickArg, EventApi } from '@fullcalendar/core'
import enLocale from '@fullcalendar/core/locales/en-gb'
import ukLocale from '@fullcalendar/core/locales/uk'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { isSameDay, parseISO } from 'date-fns'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import CalendarAppointmentCard from '@/components/CalendarAppointmentCard/CalendarAppointmentCard'
import { AppointmentInfoModal } from '@/components/modals/AppointmentInfoModal/AppointmentInfoModal'
import { SkeletonText } from '@/components/skeletons/SkeletonText'
import { H6, P } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { mockedAppointment } from '@/mocks/mockedAppointment'
import { Appointment, SupportedLocales } from '@/shared/types'

export const DoctorCalendarTab = () => {
  const t = useTranslations('page')

  const params = useParams()
  const { doctorId, locale } = params
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)

  const appointments = mockedAppointment

  const currentEvents: EventApi[] = useMemo(() => {
    return (
      (appointments?.map((appointment) => ({
        id: appointment._id,
        title: appointment.patient.userName,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime)
      })) as EventApi[]) ?? []
    )
  }, [appointments])

  const todayEvents: EventApi[] = useMemo(() => {
    return currentEvents.filter((event) => isSameDay(parseISO((event?.start || new Date()).toISOString()), new Date()))
  }, [currentEvents])

  const handleEventClick = (selected: EventClickArg) => {
    const selectedEvent = appointments?.find((appointment) => appointment._id === selected.event.id)
    if (selectedEvent) {
      setSelectedEvent(selectedEvent)
    }
  }

  const isLoading = false

  const handleEventInfoModalClose = () => setSelectedEvent(null)

  return (
    <div className='mt-6'>
      <div className='flex flex-col w-full justify-start items-start gap-8'>
        <div className='w-full h-[200px]'>
          <H6>{t('profile.doctor.todaysAppointments')}</H6>
          <ul
            className={cn(
              'flex flex-col gap-4 mt-4 overflow-y-auto h-[170px]',
              todayEvents.length === 0 && !isLoading && 'h-full mt-0'
            )}>
            {todayEvents.length === 0 && !isLoading && (
              <div className='flex flex-col items-center justify-center h-full'>
                <P className='italic text-center text-gray-400'>{t('profile.doctor.noAppointments')}</P>
              </div>
            )}

            {isLoading &&
              Array.from({ length: 2 }).map((_, index) => <SkeletonText className='w-full h-[84px]' key={index} />)}

            {todayEvents.length > 0 &&
              todayEvents.map((event: EventApi) => {
                return <CalendarAppointmentCard key={event.id} event={event} locale={locale as SupportedLocales} />
              })}
          </ul>
        </div>

        <div className='w-full'>
          <FullCalendar
            locales={[ukLocale, enLocale]}
            locale={locale === 'en' ? enLocale : ukLocale}
            height={'75vh'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventClick={handleEventClick}
            events={currentEvents.map((event) => ({
              id: event.id,
              title: event.title,
              start: event.start?.toISOString() ?? '',
              end: event.end?.toISOString() ?? ''
            }))}
          />
        </div>
      </div>

      {selectedEvent && (
        <AppointmentInfoModal
          open={!!selectedEvent}
          appointment={selectedEvent}
          handleClose={handleEventInfoModalClose}
        />
      )}
    </div>
  )
}
