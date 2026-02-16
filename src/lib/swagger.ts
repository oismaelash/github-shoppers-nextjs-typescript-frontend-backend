import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "GitHub Shoppers API",
        version: "1.0",
        description:
          "E-commerce API with AI enhancement and GitHub integration",
      },
      servers: [{ url: "/", description: "Current server" }],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "NextAuth session token",
          },
        },
        schemas: {
          // --- Item DTOs ---
          CreateItemDTO: {
            type: "object",
            required: ["name", "description", "price", "quantity"],
            properties: {
              name: { type: "string", description: "Item name" },
              description: { type: "string", description: "Item description" },
              price: { type: "number", minimum: 0.01, description: "Unit price" },
              quantity: {
                type: "integer",
                minimum: 0,
                description: "Stock quantity",
              },
            },
            example: {
              name: "Premium Widget",
              description: "High-quality widget for developers",
              price: 29.99,
              quantity: 100,
            },
          },
          UpdateItemDTO: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number", minimum: 0.01 },
              quantity: { type: "integer", minimum: 0 },
            },
            example: { name: "Updated Widget", price: 34.99 },
          },
          ItemResponseDTO: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              quantity: { type: "integer" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              shareLink: { type: "string", nullable: true },
              userId: { type: "string", nullable: true },
              sellerGithubLogin: { type: "string", nullable: true },
              sellerImage: { type: "string", nullable: true },
            },
            example: {
              id: "clx123abc",
              name: "Premium Widget",
              description: "High-quality widget",
              price: 29.99,
              quantity: 99,
              createdAt: "2025-02-16T12:00:00.000Z",
              updatedAt: "2025-02-16T12:00:00.000Z",
              shareLink: "https://example.com/share/abc123",
              sellerGithubLogin: "octocat",
            },
          },
          // --- Purchase DTOs ---
          CreatePurchaseDTO: {
            type: "object",
            required: ["itemId"],
            properties: {
              itemId: { type: "string", description: "ID of the item to purchase" },
            },
            example: { itemId: "clx123abc" },
          },
          PurchaseResponseDTO: {
            type: "object",
            properties: {
              id: { type: "string" },
              itemId: { type: "string" },
              githubLogin: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
            example: {
              id: "clx456def",
              itemId: "clx123abc",
              githubLogin: "octocat",
              createdAt: "2025-02-16T12:00:00.000Z",
            },
          },
          PurchaseListResponseDTO: {
            type: "object",
            properties: {
              id: { type: "string" },
              githubLogin: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              sellerGithubLogin: { type: "string", nullable: true },
              item: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                },
              },
            },
            example: {
              id: "clx456def",
              githubLogin: "octocat",
              createdAt: "2025-02-16T12:00:00.000Z",
              sellerGithubLogin: "seller123",
              item: { name: "Premium Widget", price: 29.99 },
            },
          },
          // --- AI DTOs ---
          EnhanceDTO: {
            type: "object",
            required: ["title", "description"],
            properties: {
              title: { type: "string", description: "Product title to enhance" },
              description: {
                type: "string",
                description: "Product description to enhance",
              },
            },
            example: {
              title: "Cool Product",
              description: "A simple product description",
            },
          },
          EnhanceResponseDTO: {
            type: "object",
            properties: {
              improvedTitle: { type: "string" },
              improvedDescription: { type: "string" },
            },
            example: {
              improvedTitle: "[AI] Premium Cool Product",
              improvedDescription: "[AI Enhanced] A refined product description...",
            },
          },
          // --- Ledger ---
          LedgerEntry: {
            type: "object",
            properties: {
              id: { type: "string" },
              product: { type: "string" },
              seller: { type: "string" },
              buyer: { type: "string" },
              price: { type: "number" },
              createdAt: { type: "string", format: "date-time" },
              status: { type: "string", enum: ["VERIFIED", "PENDING"] },
            },
          },
          // --- Sales ---
          SalesSummary: {
            type: "object",
            properties: {
              totalSales: { type: "integer" },
              revenue: { type: "number" },
              sales: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    buyer: { type: "string" },
                    pricePaid: { type: "number" },
                    createdAt: { type: "string", format: "date-time" },
                    status: { type: "string", enum: ["CONFIRMED", "PENDING"] },
                  },
                },
              },
            },
          },
          // --- Error ---
          ErrorResponse: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
            example: { error: "Validation error message" },
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
