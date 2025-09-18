'use server'

import { InferSchemaType } from 'mongoose'

import { auth } from '@/auth'
import connectMongoDB from '@/lib/mongodb'
import AnalysisModel from '@/shared/models/analysis'
import { Analysis, AnalysisFormValues } from '@/shared/types'

export const getAnalyses = async (patientId: string): Promise<Analysis[]> => {
  const session = await auth()

  if (!session || session.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()

    const analyses = await AnalysisModel.find({ patient: patientId }).lean<Analysis[]>()

    if (!analyses) {
      return []
    }

    return analyses
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}

export const getSingleAnalysis = async (patientId: string, analysisId: string): Promise<Analysis> => {
  const session = await auth()

  if (!session || session.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()

    const analysis = await AnalysisModel.findById(analysisId).lean<Analysis>()

    if (!analysis) {
      throw new Error('Error getting analysis')
    }

    return analysis
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}

export const createAnalysis = async (
  patientId: string,
  data: AnalysisFormValues
): Promise<InferSchemaType<Analysis>> => {
  const session = await auth()

  if (!session || session.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()

    const newAnalysis = await AnalysisModel.create({
      ...data,
      patientId
    })

    if (!newAnalysis) {
      throw new Error('Update failed')
    }

    return JSON.parse(JSON.stringify(newAnalysis))
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}

export const updateAnalysis = async (
  patientId: string,
  analysisId: string,
  data: AnalysisFormValues
): Promise<InferSchemaType<Analysis>> => {
  const session = await auth()

  if (!session || session.user.id !== patientId) {
    throw new Error('No access')
  }

  try {
    await connectMongoDB()

    const updAnalysis = await AnalysisModel.findOneAndUpdate(
      { _id: analysisId },
      {
        ...data
      }
    ).lean()

    if (!updAnalysis) {
      throw new Error('Update failed')
    }

    return updAnalysis
  } catch (error) {
    console.error('Error: ', error)
    throw new Error('Unexpected error')
  }
}
