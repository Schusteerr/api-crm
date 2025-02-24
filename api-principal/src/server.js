import { fastify } from "fastify";
import { DatabasePostgres } from "./database/database-postgres.js";

const server = fastify();
const database = new DatabasePostgres();

// Abaixo estrutura de CRUD (Create, Read, Update, Delete) para Criar um usuário, listar um usuário, Atualizar e Deletar um usuário por ID e, por fim, receber uma requisição do POSTBACK do CRM quando um usuário tiver o status alterado pelo mesmo, retornando uma mensagem do POSTBACK.

server.post("/leads", async (request, reply) => {
    console.log("Recebeu requisição POST /leads");
    const { name, email, phone } = request.body;

    try {
        await database.create({ name, email, phone });
        console.log(`Usuário ${name} criado com sucesso.`);

        return reply.status(201).send({
            message: `Usuário ${name} criado com sucesso.`
        });
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);
        return reply.status(400).send({
            message: error.message
        });
    }
});

server.get("/leads", async (request, reply) => {
    console.log("Recebendo requisição GET /leads");

    try {
        const leads = await database.list();

        return reply.send(leads);
    } catch (error) {
        console.error("Erro ao buscar leads:", error.message);
        return reply.status(500).send({
            message: "Erro ao buscar leads."
        });
    }
});

server.put("/leads/:id", async (request, reply) => {
    const userID = request.params.id;
    const { name, email, phone } = request.body;

    try {
        await database.update(userID, { name, email, phone });
        console.log(`Usuário ${name} atualizado com sucesso.`);
        return reply.status(204).send();
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error.message);
        return reply.status(500).send({
            message: "Não foi possível atualizar o usuário.",
            detalhes: error.message
        });
    }
});

server.delete("/leads/:id", async (request, reply) => {
    const userID = request.params.id;
    const { name, email, phone } = request.body;

    try {
        const deletedUser = await database.delete(userID);
        console.log(`Usuário ${name} deletado.`);
        return reply.status(200).send({
            message: `Usuário ${name} deletado.`,
            lead: deletedUser
        });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error.message);
        return reply.status(500).send({
            message: "Não foi possível deletar o usuário.",
            detalhes: error.message
        });
    }
});

server.post("/leads/postback", async (request, reply) => {
    console.log("Recebendo requisição POST /leads/postback");
    const  {email, status } = request.body;

    try {
        const updatedUser = await database.updateStatusByEmail(email, status);
        console.log(`Obrigado, ${updatedUser.name}, conte sempre conosco, um email de confirmação esta sendo enviado para ${email}`)
        
        return reply.send({
            message: `Obrigado, ${updatedUser.name}, conte sempre conosco, um email de confirmação esta sendo enviado para ${email}`,
            lead: updatedUser
        });
    } catch (error) {
        console.error("Erro ao atualizar status:", error.message);
        return reply.status(500).send({
            message: "Erro ao atualizar status.",
            detalhes: error.message
        });
    }
});

server.listen({ port: 3333 }).then(() => {
    console.log("API Principal rodando em http://localhost:3333");
}).catch(err => {
    console.error("Erro ao iniciar o servidor:", err.message);
});
