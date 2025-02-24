import { fastify } from "fastify";
import axios from "axios";

const server = fastify();

// Estrutura de endpoints para comunicação com a API Principal, permitindo listar os leads e enviar atualizações de status (postbacks) para a API Principal.


const API_PRINCIPAL_URL = "http://localhost:3333";
console.log(`Usando API_PRINCIPAL_URL: ${API_PRINCIPAL_URL}`);

server.get("/leads", async (request, reply) => {
    console.log("Recebendo requisição GET /leads");

    try {
        const response = await axios.get(`${API_PRINCIPAL_URL}/leads`);
        return reply.send(response.data);
    } catch (error) {
        console.error("Erro ao buscar leads da API Principal:", error.message);
        return reply.status(500).send({
            message: "Erro ao buscar leads da API principal.",
            detalhes: error.message
        });
    }
});

server.post("/leads/postback", async (request, reply) => {
    const { email, status } = request.body;

    try {
        const response = await axios.post(`${API_PRINCIPAL_URL}/leads/postback`, {
            email,
            status
        });
        return reply.send(response.data);
    } catch (error) {
        console.error("Erro ao enviar postback para a API Principal:", error.message);
        return reply.status(500).send({
            message: "Erro ao enviar postback para a API principal.",
            detalhes: error.message
        });
    }
});

server.listen({ port: 4000 }).then(() => {
    console.log(`CRM rodando em http://localhost:4000`);
});
