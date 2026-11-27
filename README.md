# Doces da Vovó

Aplicação web para clientes enviarem pedidos de doces e para o administrador consultar e gerenciar esses pedidos em um painel com login. O backend usa Node.js e Express, os dados ficam em MySQL, a aplicação é hospedada no Render e o banco de dados no Filess.io.

## Arquitetura e tecnologias

```text
Navegador (HTML, CSS e JavaScript)
              │ HTTP / JSON
              ▼
Aplicação Node.js + Express (Render)
              │ mysql2
              ▼
Banco MySQL (Filess.io)
```

| Camada | Tecnologias e responsabilidade |
| --- | --- |
| Interface | HTML, CSS e JavaScript servidos pelo Express a partir de `public/`. |
| Aplicação/API | Node.js e Express; recebe os pedidos e controla o acesso administrativo. |
| Persistência | MySQL, acessado pela biblioteca `mysql2` com pool de conexões. |
| Hospedagem | Render para a aplicação web e Filess.io para o banco MySQL. |

### Organização do código

- `server.js`: inicia o servidor HTTP e escuta a porta configurada pelo ambiente.
- `src/app.js`: configura o Express, autenticação e rotas.
- `src/routes/`: define as rotas da API de pedidos.
- `src/controllers/`: implementa operações de cadastro, consulta, atualização e exclusão.
- `src/middleware/`: valida a sessão administrativa nas operações protegidas.
- `src/config/db.js`: configura o pool de conexões MySQL.
- `public/pages/`, `public/js/` e `public/css/`: páginas e recursos da interface.
- `shemas.sql`: definição inicial do banco e da tabela de pedidos.

## Funcionalidades

### Área pública

- Formulário de pedido com nome, email e descrição do pedido.
- Validação para impedir o envio de campos vazios.
- Mensagens de sucesso e erro após o envio.
- Gravação dos pedidos no banco de dados.

### Área administrativa

- Login para acesso à página de gerenciamento.
- Listagem e atualização dos pedidos.
- Edição dos dados de um pedido.
- Exclusão de pedidos com confirmação.
- Encerramento da sessão administrativa.

## Como usar

### Enviar um pedido

1. Acesse a página inicial da aplicação.
2. Preencha nome, email e descrição do pedido.
3. Selecione **Enviar** e aguarde a mensagem de confirmação.

Os três campos são obrigatórios. A página pública não mostra a lista de pedidos nem permite alterá-los.

### Gerenciar pedidos

1. Acesse `/pages/login.html`.
2. Entre com as credenciais administrativas configuradas para o ambiente.
3. Na página de pedidos, use **Atualizar lista** para recarregar os registros.
4. Selecione **Editar** para alterar um pedido e **Salvar alterações** para confirmar. Use **Cancelar** para descartar a edição.
5. Selecione **Apagar** e confirme para excluir um pedido permanentemente.
6. Selecione **Sair** para encerrar a sessão.

A página administrativa redireciona ao login quando não há uma sessão válida. A sessão dura oito horas, é mantida em memória pelo servidor e é perdida quando o processo é reiniciado.

## Requisitos e execução

- Node.js e dependências do projeto instaladas.
- Servidor MySQL acessível pela aplicação.
- Banco de dados configurado e disponível.

Na raiz do projeto, instale as dependências e inicie o servidor:

```bash
npm install
node server.js
```

O servidor usa a variável `PORT` fornecida pelo ambiente; localmente, utiliza a porta padrão definida no código quando ela não está configurada. O processo escuta em `0.0.0.0`, requisito do Render para receber tráfego externo. Acesse a aplicação pela raiz do endereço do servidor.

O esquema da tabela está em [`shemas.sql`](./shemas.sql). A aplicação também tenta criar a tabela `pedidos` quando inicia o módulo de pedidos, caso ela ainda não exista.

## Configuração

Configure estas variáveis no ambiente de execução. Os valores devem ser fornecidos localmente pelo ambiente ou pelo painel de configuração do Render; não os registre neste README nem em arquivos versionados:

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta HTTP do servidor. |
| `DB_HOST` | Endereço do servidor MySQL. |
| `DB_PORT` | Porta do servidor MySQL. |
| `DB_USER` | Usuário utilizado para conectar ao banco. |
| `DB_PASSWORD` | Senha utilizada para conectar ao banco. |
| `DB_NAME` | Nome do banco de dados. |
| `ADMIN_USER` | Usuário da área administrativa. |
| `ADMIN_PASSWORD` | Senha da área administrativa. |

Use credenciais fortes e exclusivas para cada ambiente. Não publique senhas, tokens, strings de conexão ou outros segredos no repositório, em capturas de tela ou na documentação. O código possui valores alternativos para o login administrativo e para a conexão local ao banco quando as variáveis não estão configuradas; configure explicitamente as variáveis necessárias antes do deploy e não use esses valores alternativos em produção.

O código lê diretamente `process.env`; um arquivo `.env` não é carregado automaticamente pela aplicação. No Render, configure as variáveis no painel do serviço. O Render define `PORT` para o serviço web e, no runtime Node.js, define `NODE_ENV` como `production`.

## Deploy: Render e Filess.io

### Banco MySQL no Filess.io

1. Crie ou selecione uma instância MySQL no painel do Filess.io.
2. Crie o banco de dados e a tabela `pedidos`, se necessário. O script [`shemas.sql`](./shemas.sql) descreve o esquema; a aplicação também tenta criar a tabela ao iniciar.
3. Consulte no painel do Filess.io os dados de conexão e configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` no ambiente do serviço Render.
4. Verifique no painel e na documentação vigente do Filess.io os requisitos de conectividade, filtragem de IP e TLS/SSL para a instância escolhida. O pool MySQL deste projeto não define opções TLS explicitamente; se a instância exigir configuração específica de TLS, ela deverá ser implementada e validada no cliente antes do deploy.

Não copie os dados de conexão para o código, README, repositório ou logs públicos.

### Aplicação web no Render

1. Envie o repositório para um provedor Git conectado à sua conta Render.
2. No Render, crie um **Web Service** associado ao repositório e selecione o runtime Node.
3. Configure o comando de build como `npm install` e o comando de inicialização como `node server.js`.
4. Cadastre no painel do Render as variáveis de banco e as credenciais administrativas. Não coloque seus valores neste arquivo.
5. Inicie o deploy e confira os logs de build e execução. Após a publicação, abra a URL atribuída ao serviço e valide o envio de pedido e o acesso administrativo.

O servidor já utiliza a porta `PORT` e escuta em `0.0.0.0`, conforme os requisitos de um Render Web Service. O projeto não define atualmente uma rota HTTP `/health`; use a verificação TCP padrão do Render ou implemente uma rota de saúde antes de configurar uma verificação HTTP personalizada.

## Dados dos pedidos

A tabela `pedidos` armazena:

- `id`: identificador gerado pelo banco.
- `nome`, `email` e `pedido`: dados enviados pelo cliente.
- `criado_em`: data e hora de criação.
- `atualizado`: data e hora da última alteração.

## API

As rotas recebem e retornam JSON quando aplicável. As rotas de pedido usam os campos `nome`, `email` e `pedido`.

| Método | Rota | Descrição | Acesso |
| --- | --- | --- | --- |
| `POST` | `/pedidos` | Cadastra um pedido. | Público |
| `GET` | `/pedidos` | Lista os pedidos cadastrados. | Público no código atual |
| `PUT` | `/pedidos/:id` | Atualiza um pedido. | Sessão administrativa |
| `DELETE` | `/pedidos/:id` | Exclui um pedido. | Sessão administrativa |
| `POST` | `/admin/login` | Inicia uma sessão administrativa. | Público |
| `POST` | `/admin/logout` | Encerra a sessão administrativa. | Público |

O cadastro e a atualização exigem que os três campos estejam preenchidos. As operações protegidas retornam `401` sem uma sessão válida; erros de validação retornam `400`, e falhas no banco podem retornar `500`.

## Restrições e pontos para avaliação técnica

Os itens abaixo descrevem o comportamento atual do código e devem ser considerados antes de usar o sistema com dados reais:

- **Escopo funcional:** não há catálogo de produtos, cálculo de preços, pagamentos, acompanhamento de status ou envio de emails.
- **Exposição de dados:** `GET /pedidos` é público e retorna os registros, incluindo dados de contato. A página administrativa exige login, mas essa rota da API não. Restrinja a consulta à sessão administrativa antes de armazenar dados pessoais em produção.
- **Credenciais administrativas:** o código contém valores alternativos caso as variáveis de usuário e senha não sejam configuradas. Defina credenciais próprias no ambiente de hospedagem e remova os valores alternativos do código antes de uma publicação pública.
- **CORS:** a configuração atual aceita origens de forma ampla. Restrinja as origens permitidas se a API for acessível por outros sites.
- **Sessões:** as sessões ficam em memória no processo Node.js; reiniciar o serviço invalida todas as sessões, e múltiplas instâncias não compartilham o mesmo estado.
- **Validação:** o servidor verifica se os campos estão preenchidos, mas não valida o formato do email. O formulário público usa campo de texto para email.
- **Escala da consulta:** a listagem retorna todos os pedidos, sem paginação ou ordenação definida.
- **Resultado de edição/exclusão:** a API pode responder com sucesso mesmo quando o ID solicitado não existe.
- **Inicialização do banco:** a criação da tabela é iniciada pelo módulo de pedidos e não é aguardada antes de o servidor começar a escutar. Confirme nos logs que o banco está acessível e a tabela foi criada.

## Referências de hospedagem

- [Render: Web Services](https://render.com/docs/web-services)
- [Render: Deploy de Node.js e Express](https://render.com/docs/deploy-node-express-app)
- [Render: Variáveis de ambiente](https://render.com/docs/environment-variables)
- [Render: Health Checks](https://render.com/docs/health-checks)
- [Filess.io: plataforma e bancos suportados](https://filess.io)
- [Filess.io: documentação técnica](https://docs.filess.io)
