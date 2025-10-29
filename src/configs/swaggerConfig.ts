import swaggerJsdoc, { type Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Exemplo com Swagger',
      version: '1.0.0',
      description: 'API para exemplo de documentação Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Define onde os endpoints estão descritos
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;