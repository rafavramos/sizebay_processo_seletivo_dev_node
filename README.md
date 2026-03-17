# URL Shortener Service - Sizebay Processo Seletivo

Este é um serviço de encurtamento de URLs desenvolvido em **NestJS** com **PostgreSQL**

## Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose
- Node.js 24 (recomendado usar [nvm](https://github.com/nvm-sh/nvm))

### Versão do Node
Este projeto utiliza a versão **24** do Node.js. Para garantir a compatibilidade, você pode rodar:
```bash
nvm use
```
*(Certifique-se de ter o arquivo `.nvmrc` no diretório raiz)*

### 🐳 Rodando com Docker
A maneira mais simples de rodar o projeto é utilizando o Docker Compose:

1. Clone o repositório.
2. Certifique-se de que as portas `3000` e `5434` estão livres.
3. Execute o comando:
```bash
docker compose up -d
```
A API estará disponível em `http://localhost:3000`.

### Rodando Localmente (Desenvolvimento)
Se preferir rodar sem Docker para a aplicação (mantendo apenas o banco):

1. Instale as dependências:
```bash
npm install
```
2. Configure o arquivo `.env` (use o `.env.example` como base).
3. Inicie o servidor:
```bash
npm run start:dev
```

---

## Planejamento e Etapas de Desenvolvimento

O desenvolvimento foi dividido em etapas lógicas para garantir a entrega incremental e qualidade do código:

1.  **Etapa 1: Infraestrutura**: Configuração de NestJS, Docker, PostgreSQL e variáveis de ambiente.
2.  **Etapa 2: Modelagem**: Definição da entidade `ShortenUrl` e integração com TypeORM.
3.  **Etapa 3: Criação de URL**: Implementação do endpoint `POST /shorten` com geração de códigos Base36 curtos e únicos.
4.  **Etapa 4: Recuperação e Tracking**: Endpoint `GET /shorten/:shortCode` com rastreamento de acessos (`accessCount`).
5.  **Etapa 5: CRUD Completo**: Implementação de Atualização (`PUT`) e Exclusão (`DELETE`).
6.  **Etapa 6: Estatísticas**: Endpoint dedicado `GET /shorten/:shortCode/stats`.
7.  **Etapa 7: Documentação Swagger**: Integração com Swagger disponível em `/api`.
8.  **Etapa 8: Testes E2E e Isolamento**: Implementação de testes de ponta a ponta com banco de dados real e isolamento total entre execuções.

---

## Testes

### Executar todos os testes (Unitários + E2E)
```bash
npm run test
```

### Executar apenas testes E2E
```bash
npm run test:e2e
```
*Os testes E2E utilizam um banco de dados dedicado (`url_shortener_test`) para garantir que os dados de desenvolvimento não sejam afetados.*

---

## Documentação da API

### Swagger UI
Após iniciar o servidor, acesse a documentação interativa em:
[http://localhost:3000/api](http://localhost:3000/api)

### Postman
Uma coleção do Postman está disponível em `test/utils/postman.local.tests.json` para facilitar os testes manuais.

---
