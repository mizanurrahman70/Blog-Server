import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { UserRoutes } from './app/modules/user/user.route'
import globalErrorHandler from './app/middlewares/globalErrorhandler'
import { BlogRoutes } from './app/modules/blog/blog.route';

const app : Application = express()

//parser
app.use(express.json())
app.use(cors())

//application routes
app.use('/api', UserRoutes);
app.use('/api', BlogRoutes);
// @ts-ignore
app.use(globalErrorHandler);


app.get('/', (req : Request, res: Response) => {
    res.send('Alhamdulillah Blog is running!')
})

export default app;