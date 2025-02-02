# Projeto Web - Spring Boot & Angular

Este projeto consiste em um backend desenvolvido com Spring Boot e um frontend construído com Angular.

## 🚀 Backend

### Pré-requisitos

- Java 17
- Maven (ou use o Maven Wrapper fornecido)

### Instalação e Execução

1. Abra um terminal e navegue até o diretório [backend](backend/)
2. Para executar o backend, utilize um dos seguintes comandos:

   - **No Unix/Linux/MacOS:**
     ```sh
     ./mvnw spring-boot:run
     ```
   - **No Windows:**
     ```sh
     .\mvnw spring-boot:run
     ```
   
   O servidor backend será iniciado na porta 8080.

## 🎨 Frontend

### Pré-requisitos

- Node.js e npm
- Angular CLI (opcional; se não estiver instalado globalmente, você pode usar os comandos CLI locais)

### Instalação e Execução

1. Abra um terminal e navegue até o diretório frontend
2. Instale as dependências:
   ```sh
   npm install
   ```

3. Para iniciar o servidor de desenvolvimento local:
   ```sh
   ng serve
   ```

A aplicação Angular estará disponível em http://localhost:4200/

## 📝 Notas Importantes

- Certifique-se de que o backend esteja em execução antes de testar as chamadas API do frontend
- Alterações nos arquivos fonte acionarão automaticamente recarregamentos nos servidores de desenvolvimento

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com este projeto. Toda contribuição é bem-vinda!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.