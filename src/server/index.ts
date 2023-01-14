import cors from 'cors'
import express from 'express'
import router from './routes'
import { settings } from './config'

const app = express()
const port = settings.app.port

app.use(express.json())
app.use(cors())
app.use('/api', [router])

app.listen(port, () => {
    console.log(`API Listening on port ${port}`)
})