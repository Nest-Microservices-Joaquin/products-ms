
import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {  // Agregamos tipado a las variables de entorno.
    PORT: number
    DATABASE_URL: string
}

const envSchema = joi.object({ // Validaciones para las variables de entorno.
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required()
})
.unknown(true)

const { error, value } = envSchema.validate( process.env ) // Evaluamos las respecitvas validaciones.

if( error ){
    throw new Error(`Config validation error: ${ error.message }`)
}

const envVars : EnvVars = value // Le asignamos el tipado de las variables de entorno al objeto value.

export const envs = {   // Exportamos dichas variables.
    port : envVars.PORT,
    databaseUrl: envVars.DATABASE_URL 
}