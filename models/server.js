import express, { json } from 'express';
import dbconnection from '../config/config.db.js';
import bancoRoutes from '../routes/bancoRoutes.js';
import 'dotenv/config';
import morgan from 'morgan';



export default class Server {
    constructor() {
        this.app = express();
        this.app.use(json());
        this.app.use(morgan('dev'));
        this.dbconnection();
        this.routes();
        this.listen();
    }

    async dbconnection() {
        try {
            await dbconnection();
            console.log('Database connected');
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }

   routes(){
       this.app.use('/api',bancoRoutes)
       
   }

    

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
}
