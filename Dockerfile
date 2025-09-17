# Estágio 1: Build da aplicação React
FROM node:18-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json para o cache de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Estágio 2: Servidor de produção (Nginx)
FROM nginx:stable-alpine

# Copia os arquivos compilados do estágio de build para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Adicional: Configuração para Single-Page-Application (SPA)
# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copia a nossa configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/

# Expõe a porta 80 para acesso externo
EXPOSE 80

# O comando padrão do Nginx já inicia o servidor, então não é necessário um CMD.
