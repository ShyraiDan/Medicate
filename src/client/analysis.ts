import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getAnalyses, getSingleAnalysis, createAnalysis, updateAnalysis } from '@/lib/analysis'
import { analysesSchema } from '@/shared/schemas'
import { AnalysisFormValues, Analysis } from '@/shared/types'

export const useGetAnalysisQuery = (patientId: string) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['analysis', patientId],
    queryFn: patientId ? async () => await getAnalyses(patientId) : skipToken,
    enabled: !!patientId
  })

  return { data, isLoading, isFetching, isError }
}

export const useGetSingleAnalysisQuery = (patientId: string, analysisId: string) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: patientId && analysisId ? async () => await getSingleAnalysis(patientId, analysisId) : skipToken,
    enabled: !!patientId && !!analysisId
  })

  return { data, isLoading, isFetching, isError }
}

interface CreateAnalysisParams {
  patientId: string
  data: AnalysisFormValues
}

export const useCreateAnalysisMutation = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation<Analysis, Error, CreateAnalysisParams>({
    mutationKey: ['analysis'],
    mutationFn: async ({ patientId, data }: CreateAnalysisParams) => {
      const result = await createAnalysis(patientId, data)

      return analysesSchema.parse(result)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['analysis', patientId] })
    }
  })
}

interface UpdateAnalysisParams {
  patientId: string
  analysisId: string
  data: AnalysisFormValues
}

export const useUpdateAnalysisMutation = (patientId: string, analysisId: string) => {
  const queryClient = useQueryClient()

  return useMutation<Analysis, Error, UpdateAnalysisParams>({
    mutationKey: ['analysis', analysisId],
    mutationFn: async ({ patientId, analysisId, data }: UpdateAnalysisParams) => {
      const result = await updateAnalysis(patientId, analysisId, data)

      return analysesSchema.parse(result)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['analysis', patientId] })
    }
  })
}
