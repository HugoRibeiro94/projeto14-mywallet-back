import Joi from 'joi'

export const transactionSchema = Joi.object({
	description: Joi.string().required(),
	value: Joi.number().positive().precision(2)
})
