import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Time Tracker API",
        description: "API de gestion de temps pour suivre les projets et les tâches",
        version: "1.0.0"
    },
    host: process.env.HOST + ':' + process.env.PORT,
    basePath: "/",
    schemes: ["http"],
    tags: [
        {
            name: "Projects",
            description: "Endpoints relatifs à la gestion des projets"
        },
        {
            name: "Tasks",
            description: "Endpoints relatifs à la gestion des tâches"
        },
        {
            name: "Users",
            description: "Endpoints relatifs à la gestion des utilisateurs"
        },
        {
            name: "Authentication",
            description: "Endpoints relatifs à l'authentification"
        }
    ],
}

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);