const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
connectDB();

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Rotas
app.use('/api', require('./Routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
