import mongoose, { HydratedDocument, InferSchemaType, Model, Schema } from 'mongoose'

const mongoDoctorSchema = new Schema(
  {
    doctorName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    image: String,
    description: String
  },
  {
    timestamps: true
  }
)

export type Doctor = InferSchemaType<typeof mongoDoctorSchema>
export type PatientDoc = HydratedDocument<Doctor>

const DoctorModel = (mongoose.models.Doctors as Model<Doctor>) || mongoose.model('Doctors', mongoDoctorSchema)
export default DoctorModel
