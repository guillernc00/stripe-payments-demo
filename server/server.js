import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { products } from './products.js';

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//Health check

app.get('/health', (req, res) => {
    res.json({status: 'ok'})
})

app.get('/api/products', (req, res) => {
    res.json(products);
});

//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})