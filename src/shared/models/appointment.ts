import { HydratedDocument, InferSchemaType, Model, Schema, models, model } from 'mongoose'

const mongoAppointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patients',
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctors',
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: String,
  analyses: {
    type: [Schema.Types.ObjectId],
    ref: 'Analyses'
  },
  fileName: String
})

export type Appointment = InferSchemaType<typeof mongoAppointmentSchema>
export type AppointmentDoc = HydratedDocument<Appointment>

const AppointmentModel = (models.Appointments as Model<Appointment>) || model('Appointments', mongoAppointmentSchema)
export default AppointmentModel
