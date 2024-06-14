import express from 'express';
import router from './routes/index';

const server = express();
const PORT = process.env.PORT || 5000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(router);

server.listen(PORT, () => console.log(`Server Running on http://localhost:${PORT}`));
