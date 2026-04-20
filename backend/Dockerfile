FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma

COPY src ./src

RUN mkdir -p uploads logs

COPY start.sh ./
RUN chmod +x ./start.sh

EXPOSE 5000

CMD ["./start.sh"]
