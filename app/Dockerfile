# Usa uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app



COPY . .

# Instala as dependências da aplicação

RUN npm install --production
RUN cd views && npm run build

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta na qual o aplicativo será executado
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]
