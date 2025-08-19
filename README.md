# Automate

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível recuperar a senha;
- [ ] Deve ser possível cadastrar meus carros;
- [ ] Deve ser possível editar meus carros;
- [ ] Deve ser possível excluir meus carros;
- [ ] Deve ser possível listar os meus carros;
- [ ] Deve ser possível obter meu carro por um identificador;
- [ ] Deve ser possível cadastrar categorias de despesa;
- [ ] Deve ser possível editar categorias de despesa;
- [ ] Deve ser possível excluir categorias de despesa;
- [ ] Deve ser possível adicionar uma despesa ao meu carro;
- [ ] Deve ser possível editar uma despesa do meu carro;
- [ ] Deve ser possível excluir uma despesa do meu carro;
- [ ] Deve ser possível agendar uma despesa para o meu carro;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] A senha do usuário deve ter pelo menos 6 caracteres;
- [ ] Diferentes usuários devem poder cadastrar carros com a mesma placa;
- [ ] A primeira despesa de um carro deve ser sempre a sua compra;
- [ ] O provedor do serviço que gerou a despesa deve ser informado;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
- [ ] O access token do usuário deve ser válido por 10 minutos;
- [ ] O usuário deve receber um refresh token, válido por 7 dias;
