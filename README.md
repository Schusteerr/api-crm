# 📊 Automação de Leads e Notificações

Projeto API para gerenciar leads e integrar um CRM usando **Node.js**, **Fastify**, **PostgreSQL** e **Docker**.

## 🎯 Objetivos do Projeto
Pequeno serviço web que:
1. Receba dados de um formulário de lead (nome, e-mail e telefone).
2. Envie esses dados via API para um sistema de CRM fictício.
3. Configure um endpoint de POSTBACK para receber notificações de conversão do CRM.
4. Armazene os leads e suas conversões em um banco de dados.
5. Dispare uma mensagem para cada novo lead convertido.

## 🚀 Tecnologias Usadas
- Node.js
- Fastify
- PostgreSQL
- Docker

## 🔧 Como Rodar o Projeto

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/Schusteerr/api-crm
cd api-crm
```

### 2️⃣ Configure o Ambiente  
Crie um arquivo `.env` e defina as credenciais de acordo com seu PostgreSQL no arquivo `docker-compose.yml`  
 _*Altere as variáveis em ambos conforme necessário para seu uso:_:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=leads
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### 3️⃣ Suba o Banco de Dados com Docker  
_*Certifique-se de que não haja outros contêineres utilizando as mesmas portas para evitar conflitos._

```bash
docker-compose up --build -d
```

### 4️⃣ Instale as Dependências
```bash
cd api-principal
npm install fastify postgres dotenv

cd ../fake-crm
npm install fastify postgres dotenv axios
```

### 5️⃣ Inicie os Servidores
Inicie o servidor da API Principal:
```bash
cd api-principal
node src/server.js
```

Inicie o servidor do CRM:
```bash
cd ../fake-crm
node src/server.js
```

### 6️⃣ Teste as Rotas  
  * Use os arquivos `routes.http` dentro dos diretórios `./api-principal/` e `./fake-crm/` para testar as rotas rapidamente no seu editor de código.
  * Certifique-se de que o banco de dados esteja rodando corretamente via Docker.

## 📌 Rotas Disponíveis
### API Principal
- `POST /leads` → Criar um lead  
- `GET /leads` → Listar todos os leads  
- `PUT /leads/:id` → Atualizar um lead  
- `DELETE /leads/:id` → Deletar um lead 

### CRM
- `GET /leads` → Obter lista de leads do CRM (consulta API Principal)  
- `POST /leads/postback` → Simular envio de status atualizado para API Principal  
