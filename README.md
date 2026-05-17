# ElectroStore

Avaliação Prática 01 - Backend II

## Como rodar

1. Criar o banco e o usuário no MySQL:

```sql
CREATE DATABASE produtos;
CREATE USER IF NOT EXISTS 'avaliacao_fullstack'@'localhost' IDENTIFIED BY avaliacao_fullstack';
GRANT ALL PRIVILEGES ON produtos.* TO 'avaliacao_fullstack'@'localhost';
FLUSH PRIVILEGES;
```

2. Instalar dependências:

```
npm install
```

3. Criar as tabelas no banco:

```
node ./model/modelos.js
```

Esperar a mensagem "Modelos sincronizados com o banco de dados." e fechar com Ctrl+C.

4. Inserir as categorias:

```sql
USE produtos;
INSERT INTO Categoria (nome) VALUES ('Notebook'), ('Celular'), ('Teclado'), ('Tablet');
```

5. Iniciar a aplicação:

```
npm start
```

Acessar em http://localhost:3000

## Usuários

O cadastro é feito pela tela /usuarios/cria. Todo novo usuário é criado com perfil "usuario".

Para alterar o perfil, fazer direto no banco como no exemplo:

```sql
UPDATE Usuario SET perfil = 'admin'   WHERE email = 'admin@teste.com';
UPDATE Usuario SET perfil = 'lojista' WHERE email = 'lojista@teste.com';
```
