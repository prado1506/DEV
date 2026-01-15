# Estágio 1: Build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build -- --configuration production

# Estágio 2: Servir com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
