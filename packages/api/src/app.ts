import express, { Response } from 'express'

const createApp = () =>
  express()
    .get('/ping', (_req, res: Response) =>  res.send('pong'))

const startApp = (port = 8080) =>
    createApp().listen(port, () => console.log(`Server running on port ${port} 🍺`))

export { createApp, startApp }
