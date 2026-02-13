import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // define api folder
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'GitHub Shoppers API',
        version: '1.0',
        description: 'E-commerce API with AI enhancement and GitHub integration',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
