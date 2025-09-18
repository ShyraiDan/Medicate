import { HydratedDocument, InferSchemaType, Model, Schema, models, model } from 'mongoose'

const mongoAnalysisSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patients',
    required: true
  },
  analysisName: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: String,
    required: true
  },
  fileName: String
})

export type Analysis = InferSchemaType<typeof mongoAnalysisSchema>
export type AnalysisDoc = HydratedDocument<Analysis>

const AnalysisModel = (models.Analyses as Model<Analysis>) || model('Analyses', mongoAnalysisSchema)
export default AnalysisModel
