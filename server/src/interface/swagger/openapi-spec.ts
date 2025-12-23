export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Fyndam Music Recognition API",
    version: "1.0.0",
    description: "REST API for Shazam-like music recognition using audd.io",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  paths: {
    "/recognize/upload": {
      post: {
        tags: ["Recognition"],
        summary: "Recognize music from uploaded audio file",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  audio: {
                    type: "string",
                    format: "binary",
                    description: "Audio file (mp3, wav, or m4a)",
                  },
                },
                required: ["audio"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Recognition successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RecognitionResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/recognize/stream": {
      post: {
        tags: ["Recognition"],
        summary: "Recognize music from audio stream chunks",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  audioChunks: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "byte",
                    },
                    description: "Base64-encoded audio chunks",
                  },
                  format: {
                    type: "string",
                    enum: ["mp3", "wav", "m4a"],
                    default: "mp3",
                  },
                },
                required: ["audioChunks"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Recognition successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RecognitionResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/history": {
      get: {
        tags: ["History"],
        summary: "Get recognition history",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              default: 50,
              maximum: 100,
            },
          },
          {
            name: "offset",
            in: "query",
            schema: {
              type: "integer",
              default: 0,
            },
          },
        ],
        responses: {
          "200": {
            description: "History retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RecognitionHistoryResponse",
                },
              },
            },
          },
        },
      },
    },
    "/history/{id}": {
      get: {
        tags: ["History"],
        summary: "Get recognition by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Recognition found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RecognitionResponse",
                },
              },
            },
          },
          "404": {
            description: "Recognition not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RecognitionResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          timestamp: {
            type: "string",
            format: "date-time",
          },
          inputType: {
            type: "string",
            enum: ["upload", "live"],
          },
          auddResponse: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              result: {
                type: "object",
                nullable: true,
                properties: {
                  artist: {
                    type: "string",
                  },
                  title: {
                    type: "string",
                  },
                  album: {
                    type: "string",
                  },
                  release_date: {
                    type: "string",
                  },
                  song_link: {
                    type: "string",
                  },
                },
              },
            },
          },
          audioMetadata: {
            type: "object",
            properties: {
              duration: {
                type: "number",
              },
              format: {
                type: "string",
                enum: ["mp3", "wav", "m4a"],
              },
              size: {
                type: "number",
              },
            },
          },
          confidence: {
            type: "number",
            nullable: true,
          },
        },
      },
      RecognitionHistoryResponse: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              $ref: "#/components/schemas/RecognitionResponse",
            },
          },
          total: {
            type: "number",
          },
          limit: {
            type: "number",
          },
          offset: {
            type: "number",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
          },
          message: {
            type: "string",
          },
          statusCode: {
            type: "number",
          },
        },
      },
    },
  },
};
