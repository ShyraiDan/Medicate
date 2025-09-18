'use server'

import { InferSchemaType } from 'mongoose'

import { auth } from '@/auth'
import connectMongoDB from '@/lib/mongodb'
import AppointmentModel from '@/shared/models/appointment'
import {
  Appointment,
  PatientAppointment,
  PatientCreateAppointmentFormValuesDto,
  PatientEditAppointmentFormValuesDto
} from '@/shared/types'

export const getPatientAppointments = async (patientId: string): Promise<PatientAppointment[]> => {
  const session = await auth()

  if (!session || session.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()
    const appointments = await AppointmentModel.find({ patient: patientId })
      .populate('doctor', 'doctorName position')
      .lean<Appointment[]>()

    if (!appointments) {
      throw new Error('Update failed')
    }

    const appointmentDto = appointments.map((appointment) => ({
      _id: appointment._id,
      doctorName: appointment.doctor.doctorName,
      doctorPosition: appointment.doctor.position,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      description: appointment.description,
      analyses: appointment.analyses,
      fileName: appointment.fileName,
      reason: appointment.reason
    }))

    return appointmentDto
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}

export const getSinglePatientAppointment = async (
  patientId: string,
  appointmentId: string
): Promise<PatientAppointment> => {
  const session = await auth()

  if (!session || session.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate('doctor', 'doctorName position')
      .lean<Appointment>()

    if (!appointment) {
      throw new Error('Update failed')
    }

    if (appointment?.patient._id.toString() !== patientId) {
      throw new Error('No access')
    }

    return {
      _id: appointment._id,
      doctorName: appointment.doctor.doctorName,
      doctorPosition: appointment.doctor.position,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      description: appointment.description,
      analyses: appointment.analyses,
      fileName: appointment.fileName,
      reason: appointment.reason
    }
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}

// TODO: Test this endpoint
export const createPatientAppointment = async (
  patientId: string,
  data: PatientCreateAppointmentFormValuesDto
): Promise<InferSchemaType<PatientAppointment>> => {
  const session = await auth()

  if (session?.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()

    const appointment = await AppointmentModel.create({
      ...data
    })

    if (!appointment) {
      throw new Error('Update failed')
    }

    return appointment
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}

// TODO: Test this endpoint
export const updatePatientAppointment = async (
  patientId: string,
  appointmentId: string,
  data: PatientEditAppointmentFormValuesDto
): Promise<InferSchemaType<PatientAppointment>> => {
  const session = await auth()

  if (session?.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()

    const appointment = await AppointmentModel.findOneAndUpdate(
      { _id: appointmentId },
      {
        ...data
      }
    ).lean()

    if (!appointment) {
      throw new Error('Update failed')
    }

    return appointment
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}
