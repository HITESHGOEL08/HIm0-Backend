// swagger.ts
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Raha Backend - Monolithic",
      version: "1.0.0",
      description: "API description",
    },
    servers: [
      {
        url: "http://localhost:3000", // Your API server URL
      },
    ],
  },
  apis: [path.join(__dirname, "**/routes/**/*.ts")], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;
