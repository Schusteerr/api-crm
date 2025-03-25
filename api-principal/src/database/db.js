import { createRequire } from "module";
import dotenv from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const require = createRequire(import.meta.url);
const postgres = require("postgres");

export const sql = postgres({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 1234,
    username: process.env.POSTGRES_USER || 'user_example',
    password: process.env.POSTGRES_PASSWORD || 'user_pass',
    database: process.env.POSTGRES_DB || 'db_example',
    max: 10,
});

export const testConnection = async () => {
    try {
        await sql`SELECT 1+1 AS result`;
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    } catch (error) {
        console.error("Erro ao conectar com o banco de dados:", error.message);
    }
};

testConnection();