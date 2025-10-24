# Set up env for node.js to run nextjs app
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG NEXT_PUBLIC_BASE_URL=http://localhost:5550
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
RUN npm run build
EXPOSE 5501

# Run nextjs app
FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
CMD ["npm", "start"]