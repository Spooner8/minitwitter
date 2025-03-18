import type { Request } from 'express'
import pinoHttp from 'pino-http'
import pino from 'pino'

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

/**
 * @description
 * Logger instance for logging messages
 */
const logger = pino({
  level: LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
  },
})

/**
 * @description
 * Logger instance for logging http requests
 */
const httpLogger = pinoHttp({
  logger: logger,
  customProps: (req: Request) => {
    return {
      userId: req.user?.id,
      username: req.user?.username,
    }
  },
})

export { logger, httpLogger }
