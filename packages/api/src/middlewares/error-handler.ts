import {ErrorRequestHandler} from "express"
import {errors} from 'business'

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof errors.BusinessError) {
    res.status(400).json({ error: err.message })
  } else {
    res.status(500).json({ error: `An error occurred: ${err.message || "unknown error"}` })
  }
}

export { errorMiddleware }
