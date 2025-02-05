FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Add environment variables
ENV REGION=us-east-1
ENV AWS_ACCESS_KEY_ID=dummy
ENV AWS_SECRET_ACCESS_KEY=dummy
ENV DYNAMODB_ENDPOINT=http://host.docker.internal:8000
ENV TABLE_NAME=Customers

EXPOSE 3000
CMD ["node", "src/index.js"]
