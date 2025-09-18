import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getPatientAppointments,
  getSinglePatientAppointment,
  createPatientAppointment,
  updatePatientAppointment
} from '@/lib/appointment'
import { patientAppointmentSchema } from '@/shared/schemas'
import {
  PatientAppointment,
  PatientCreateAppointmentFormValuesDto,
  PatientEditAppointmentFormValuesDto
} from '@/shared/types'

export const usePatientAppointmentsQuery = (patientId: string) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['appointments', patientId],
    queryFn: patientId ? async () => await getPatientAppointments(patientId) : skipToken,
    enabled: !!patientId
  })

  return { data, isLoading, isFetching, isError }
}

export const useSinglePatientAppointmentQuery = (patientId: string, appointmentId: string) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn:
      patientId && appointmentId ? async () => await getSinglePatientAppointment(patientId, appointmentId) : skipToken,
    enabled: !!patientId && !!appointmentId
  })

  return { data, isLoading, isFetching, isError }
}

interface CreateAppointmentParams {
  patientId: string
  data: PatientCreateAppointmentFormValuesDto
}

export const useCreateAppointmentMutation = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation<PatientAppointment, Error, CreateAppointmentParams>({
    mutationKey: ['appointment'],
    mutationFn: async ({ patientId, data }: CreateAppointmentParams) => {
      const result = await createPatientAppointment(patientId, data)

      return patientAppointmentSchema.parse(result)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments', patientId] })
    }
  })
}

interface UpdateAppointmentParams {
  patientId: string
  appointmentId: string
  data: PatientEditAppointmentFormValuesDto
}

export const useUpdateAppointmentMutation = (patientId: string, appointmentId: string) => {
  const queryClient = useQueryClient()

  return useMutation<PatientAppointment, Error, UpdateAppointmentParams>({
    mutationKey: ['appointment', appointmentId],
    mutationFn: async ({ patientId, appointmentId, data }: UpdateAppointmentParams) => {
      const result = await updatePatientAppointment(patientId, appointmentId, data)

      return patientAppointmentSchema.parse(result)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments', patientId] })
    }
  })
}
