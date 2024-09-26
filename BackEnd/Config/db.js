const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Banco de dados conectado!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra o servidor se não conseguir conectar
    }
};

module.exports = connectDB;
