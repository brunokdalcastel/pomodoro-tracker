# Pomodoro Tracker

Um simples, mas poderoso, tracker de tempo baseado na técnica Pomodoro. Esta aplicação web permite que os usuários configurem seus próprios tempos de foco e intervalo, gerenciem uma lista de matérias ou tarefas, e registrem o tempo de estudo para cada uma delas.

A aplicação foi desenvolvida para rodar localmente via Docker e todos os dados são persistidos no `localStorage` do navegador.

## ✨ Features

- **Timer Pomodoro:** Contagem regressiva para ciclos de foco e intervalo.
- **Durações Customizáveis:** Configure a duração (em minutos) dos seus ciclos de foco e de intervalo.
- **Gerenciamento de Matérias:** Adicione e nomeie as matérias ou tarefas que você deseja rastrear.
- **Registro de Tempo:** Ao final de cada ciclo de foco, o tempo é automaticamente atribuído à matéria selecionada.
- **Persistência de Dados:** Suas matérias e o tempo de estudo acumulado são salvos localmente no seu navegador, para que não se percam.
- **Containerizado com Docker:** A aplicação vem pronta para ser executada em um container Docker, garantindo consistência em qualquer ambiente.

## 🚀 Tecnologias Utilizadas

- **Frontend:** [React.js](https://reactjs.org/)
- **Estilização:** [Bootstrap](https://getbootstrap.com/)
- **Servidor de Produção:** [Nginx](https://www.nginx.com/)
- **Containerização:** [Docker](https://www.docker.com/)

## ⚙️ Como Executar o Projeto

Você precisará ter o [Docker](https://www.docker.com/products/docker-desktop/) instalado e em execução.

1.  **Clone ou baixe este repositório.**

2.  **Navegue até a pasta do projeto** pelo seu terminal:
    ```bash
    cd caminho/para/pomodoro-app
    ```

3.  **Construa a imagem Docker:**
    ```bash
    docker build -t pomodoro-app .
    ```

4.  **Execute o container:**
    ```bash
    docker run -p 8080:80 pomodoro-app
    ```

5.  **Acesse a aplicação** abrindo seu navegador no endereço: `http://localhost:8080`

## 👨‍💻 Como Executar em Modo de Desenvolvimento

Se você deseja modificar o código-fonte:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```

Isso iniciará a aplicação em `http://localhost:3000` com hot-reload ativado.