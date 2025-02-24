import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DatabasePostgres {

    // Implementação de métodos CRUD para gerenciar usuários no banco de dados PostgreSQL, incluindo criação, leitura, atualização e exclusão de usuários, bem como atualização do status do CRM através do email do usuário.


    async list() {
        try {
            const leads = await sql`SELECT * FROM leads`;
            return leads;
        } catch (error) {
            throw new Error("Não foi possível buscar os leads.");
        }
    }

    async create(user) {
        try {
            const { name, email, phone } = user;
            const existingEmail = await sql`SELECT * FROM leads WHERE email = ${email}`;
            if (existingEmail.length > 0) throw new Error("Esse email já existe.");
            const existingPhone = await sql`SELECT * FROM leads WHERE phone = ${phone}`;
            if (existingPhone.length > 0) throw new Error("Esse telefone já está cadastrado.");

            const userID = randomUUID();
            const userSTATUS = "prospecting";

            await sql`INSERT INTO leads (id, status, name, email, phone) VALUES (${userID}, ${userSTATUS}, ${name}, ${email}, ${phone})`;
        } catch (error) {
            throw new Error(error.message || "Erro ao criar usuário.");
        }
    }

    async update(id, user) {
        try {
            const { name, email, phone } = user;

            const result = await sql`
                UPDATE leads 
                SET 
                    name = ${name}, 
                    email = ${email}, 
                    phone = ${phone} 
                WHERE id = ${id}
                RETURNING *;
            `;

            if (result.count === 0) {
                throw new Error("Usuário não encontrado.");
            }

            const updatedUser = result[0];  // Definir a variável updatedUser
            return updatedUser;  // Retornar a variável updatedUser
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw new Error("Não foi possível atualizar o usuário.");
        }
    }

    async delete(id) {
        try {
            const result = await sql`
                DELETE FROM leads 
                WHERE id = ${id}
                RETURNING *;
            `;

            if (result.count === 0) {
                throw new Error("Usuário não encontrado.");
            }

            return result[0];  // Retornar o usuário deletado
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw new Error("Não foi possível deletar o usuário.");
        }
    }
    
    async updateStatusByEmail(email, status) {
        try {
            const result = await sql`UPDATE leads SET status = ${status} WHERE email = ${email} RETURNING *`;
            if (result.count === 0) throw new Error("Usuário não encontrado.");

            const updatedUser = result[0];  // Definir a variável updatedUser
            return updatedUser;  // Retornar a variável updatedUser
        } catch (error) {
            throw new Error("Erro ao atualizar status.");
        }
    }
}
