import { endOfToday, isAfter } from 'date-fns'
import { z } from 'zod'

import { SUPPORTED_LOCALES } from '@/shared/constants'

export type Locale = (typeof SUPPORTED_LOCALES)[number]

const localizedStringSchema = z
  .object(Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, z.string().min(1)])) as Record<Locale, z.ZodString>)
  .strict()

export const optionSchema = z.object({
  value: z.string(),
  label: z.string()
})

export const serviceSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string()
})

export const departmentSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string()
})

export const contactsItemSchema = z.object({
  icon: z.string(),
  type: z.string(),
  title: z.string(),
  info: z.string()
})

export const contactsAdvantageItemSchema = z.object({
  icon: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string()
})

export const contactsOfficeItemSchema = z.object({
  address: z.string(),
  email: z.string(),
  phone: z.string()
})

export const workingHoursItemSchema = z.object({
  businessDay: z.string(),
  saturday: z.string(),
  sunday: z.string()
})

export const blogSchema = z.object({
  _id: z.string(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  image: z.string(),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const blogFormValuesSchema = blogSchema.pick({
  title: true,
  description: true,
  image: true
})

export const patientSchema = z.object({
  _id: z.string(),
  email: z.email('validation.emailInvalid').nonempty('validation.emailRequired'),
  userName: z
    .string()
    .nonempty('validation.nameRequired')
    .min(3, 'validation.nameMinLength')
    .max(50, 'validation.nameMaxLength'),
  dateOfBirth: z
    .date()
    .optional()
    .refine((d) => !isAfter(d ?? new Date(), endOfToday()), {
      message: 'validation.futureDate'
    }),
  phoneNumber: z.string().optional(),
  bloodType: z.string().optional(),
  diabetes: z.string().optional(),
  rhFactor: z.string().optional(),
  bloodTransfusion: z.string().optional(),
  intoleranceToMedicines: z.string().optional(),
  infectiousDiseases: z.string().optional(),
  surgicalInterventions: z.string().optional(),
  allergies: z.string().optional(),
  image: z.string().optional()
})

export const doctorSchema = z.object({
  _id: z.string(),
  email: z.email(),
  doctorName: z.string(),
  position: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  phone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const analysesSchema = z.object({
  _id: z.string(),
  patientId: z.string(),
  analysisName: z.string('validation.analysisNameRequired'),
  date: z.date('validation.analysisDateRequired'),
  description: z.string().optional(),
  fileName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const appointmentSchema = z.object({
  _id: z.string(),
  reason: z.string('validation.reasonRequired'),
  startTime: z.date('validation.startTimeRequired'),
  patient: patientSchema,
  doctor: doctorSchema,
  endTime: z.date(),
  description: z.string().optional(),
  analyses: z.array(analysesSchema),
  fileName: z.string().optional()
})

export const patientAppointmentSchema = appointmentSchema
  .pick({
    _id: true,
    reason: true,
    startTime: true,
    endTime: true,
    description: true,
    analyses: true,
    fileName: true
  })
  .extend({
    doctorName: z.string(),
    doctorPosition: z.string()
  })

export const paymentSchema = z.object({
  _id: z.string(),
  appointment: appointmentSchema,
  amount: z.number(),
  isPayed: z.boolean(),
  patient: patientSchema,
  createdAt: z.date(),
  updatedAt: z.date()
})

export const patientAppointmentFormValuesSchema = appointmentSchema
  .pick({
    reason: true,
    startTime: true,
    endTime: true,
    description: true,
    analyses: true,
    fileName: true
  })
  .extend({
    doctorId: z.string(), // required
    specialty: z.string(), // required
    startTimeHours: z.string() // required
  })

export const patientEditAppointmentFormValuesDtoSchema = patientAppointmentFormValuesSchema
  .pick({
    reason: true,
    startTime: true,
    endTime: true,
    description: true,
    analyses: true,
    fileName: true,
    doctorId: true
  })
  .extend({
    _id: z.string()
  })

export const patientCreateAppointmentFormValuesDtoSchema = patientAppointmentFormValuesSchema.pick({
  reason: true,
  startTime: true,
  endTime: true,
  description: true,
  analyses: true,
  fileName: true,
  doctorId: true
})

export const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string()
})

export const analysisFormValuesSchema = analysesSchema.pick({
  analysisName: true,
  date: true,
  description: true,
  fileName: true
})

export const reviewSchema = z.object({
  _id: z.string(),
  userName: z.string(),
  userPhoto: z.string(),
  userPosition: z.string(),
  review: z.string()
})

export const patientSignInFormValuesSchema = z.object({
  email: z.email('validation.emailInvalid').nonempty('validation.emailRequired'),
  password: z
    .string()
    .nonempty('validation.passwordRequired')
    .min(8, 'validation.passwordMinLength')
    .max(20, 'passwordMaxLength')
})

export const patientSignUpFormValuesSchema = z
  .object({
    email: z.email('validation.emailInvalid').nonempty('validation.emailRequired'),
    userName: z
      .string()
      .nonempty('validation.nameRequired')
      .min(3, 'validation.nameMinLength')
      .max(50, 'validation.nameMaxLength'),
    password: z
      .string()
      .nonempty('validation.passwordRequired')
      .min(8, 'validation.passwordMinLength')
      .max(20, 'validation.passwordMaxLength'),
    confirmPassword: z
      .string()
      .nonempty('validation.passwordRequired')
      .min(8, 'validation.passwordMinLength')
      .max(20, 'validation.passwordMaxLength')
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'validation.confirmPasswordMismatch'
      })
    }
  })

export const doctorSignInFormValuesSchema = z.object({
  email: z.email('validation.emailInvalid').nonempty('validation.emailRequired'),
  password: z
    .string()
    .nonempty('validation.passwordRequired')
    .min(8, 'validation.passwordMinLength')
    .max(20, 'validation.passwordMaxLength')
})

export const doctorSignUpFormValuesSchema = z
  .object({
    email: z.email('validation.emailInvalid').nonempty('validation.emailRequired'),
    doctorName: z
      .string()
      .nonempty('validation.nameRequired')
      .min(3, 'validation.nameMinLength')
      .max(50, 'validation.nameMaxLength'),
    password: z
      .string()
      .nonempty('validation.passwordRequired')
      .min(8, 'validation.passwordMinLength')
      .max(20, 'validation.passwordMaxLength'),
    confirmPassword: z
      .string()
      .nonempty('validation.passwordRequired')
      .min(8, 'validation.passwordMinLength')
      .max(20, 'validation.passwordMaxLength'),
    verificationCode: z.string().nonempty('validation.verificationCodeRequired'),
    position: z.string().nonempty('validation.positionRequired'),
    phone: z.string().nonempty('validation.phoneRequired')
  })
  .superRefine(({ password, confirmPassword, verificationCode }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'validation.confirmPasswordMismatch'
      })
    }

    if (verificationCode !== process.env.NEXT_PUBLIC_DOCTOR_SIGNUP_VERIFICATION_CODE) {
      ctx.addIssue({
        code: 'custom',
        path: ['verificationCode'],
        message: 'validation.verificationCodeMismatch'
      })
    }
  })

export const editPatientFormValuesSchema = patientSchema.pick({
  email: true,
  userName: true,
  dateOfBirth: true,
  phoneNumber: true,
  bloodType: true,
  diabetes: true,
  rhFactor: true,
  bloodTransfusion: true,
  intoleranceToMedicines: true,
  infectiousDiseases: true,
  surgicalInterventions: true,
  allergies: true,
  image: true
})

export const editDoctorFormValuesSchema = doctorSchema.pick({
  email: true,
  doctorName: true,
  position: true,
  image: true,
  phone: true
})

export const dbErrorSchema = z.object({
  code: z.string(),
  message: z.string()
})
