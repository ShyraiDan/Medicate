'use client'

import { useTranslations } from 'next-intl'

import { DoctorAppointmentTab } from '@/components/doctorTabs/DoctorAppointmentTab'
import { DoctorCalendarTab } from '@/components/doctorTabs/DoctorCalendarTab'
import { PageHeading } from '@/components/PageHeading/PageHeading'
import { SkeletonAvatar } from '@/components/skeletons/SkeletonAvatar'
import { SkeletonText } from '@/components/skeletons/SkeletonText'
import { StyledTab } from '@/components/StyledTab/StyledTab'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { H2, H6, P } from '@/components/ui/typography'
import { mockedDoctors } from '@/mocks/mockedDoctors'

const TABS_ENUM = {
  APPOINTMENTS: 'appointments',
  CALENDAR: 'calendar'
}

interface DoctorProfileProps {
  params: Promise<{ doctorId: string }>
}

const DoctorProfile = ({ params }: DoctorProfileProps) => {
  const t = useTranslations('page')

  const isLoading = true
  const mockedDoctor = mockedDoctors[0]

  return (
    <div className='shadow-custom-right bg-white py-[30px] px-4'>
      <div className='mt-12 flex flex-col items-center justify-center relative lg:mt-6'>
        {/* {doctorProfile && <EditDoctorModal doctor={doctorProfile} />} */}

        <SkeletonAvatar />
        {/* {isLoading ? (
          <SkeletonAvatar />
        ) : doctorProfile?.image ? (
          <Image
            src={`${BUCKET_URL}/custom/avatars/${doctorProfile.image}`}
            width={80}
            height={80}
            alt='User avatar'
            unoptimized
            className='w-[80px] h-[80px] rounded-full'
          />
        ) : (
          <div className='flex items-center justify-center w-[80px] h-[80px] bg-blue-100 rounded-full'>
             <User size={24} fill='#fff' />
          </div>
        )} */}

        {isLoading ? (
          <SkeletonText className='px-4 mt-2 h-7 w-[180px]' />
        ) : (
          <P className='px-4 line-clamp-2 text-lg font-bold mt-2'>{mockedDoctor?.doctorName}</P>
        )}
        <div className='w-full'>
          <H2 className='text-lg mb-4 mt-6'>{t('profile.personalInfo')}</H2>
          <ul className='flex flex-col gap-3 md:grid md:grid-cols-3 lg:grid-cols-1'>
            <li>
              <P className='mb-1 text-xs'>{t('profile.doctor.speciality')}</P>
              {isLoading ? (
                <SkeletonText className='h-5 w-[180px] mt-2 mb-1' />
              ) : (
                <H6 className='text-lg'>{mockedDoctor?.position || '-'}</H6>
              )}
            </li>
            <li>
              <P className='mb-1 text-xs'>E-mail</P>

              {isLoading ? (
                <SkeletonText className='h-5 w-[180px] mt-2 mb-1' />
              ) : (
                <H6 className='text-lg'>{mockedDoctor?.email || '-'}</H6>
              )}
            </li>
            <li>
              <P className='mb-1 text-xs'>{t('profile.phoneNumber')}</P>

              {isLoading ? (
                <SkeletonText className='h-5 w-[180px] mt-2 mb-1' />
              ) : (
                <H6 className='text-lg'>{mockedDoctor?.phone || '-'}</H6>
              )}
            </li>
          </ul>
        </div>
        <div className='w-full'>
          <Button className='mt-8 bg-red'>{t('profile.leave')}</Button>
        </div>
      </div>
    </div>
  )
}

const tabs = [
  { id: TABS_ENUM.APPOINTMENTS, label: 'profile.doctor.appointments', content: <DoctorAppointmentTab /> },
  { id: TABS_ENUM.CALENDAR, label: 'profile.doctor.calendar', content: <DoctorCalendarTab /> }
]

interface DoctorProfilePageProps {
  params: Promise<{ doctorId: string }>
}

const DoctorProfilePage = ({ params }: DoctorProfilePageProps) => {
  const t = useTranslations('page')

  return (
    <>
      <PageHeading title={t('profile.doctor.title')} />
      <Container className='lg:grid lg:grid-cols-[1fr_270px] lg:gap-4 xl:grid-cols-[1fr_320px]'>
        <div className='mb-[30px] lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:mb-0'>
          <DoctorProfile params={params} />
        </div>
        <div className='lg:col-start-1 lg:col-end-2 lg:row-start-1'>
          <StyledTab tabs={tabs} defaultValue={tabs[0].id} />
        </div>
      </Container>
    </>
  )
}

export default DoctorProfilePage
