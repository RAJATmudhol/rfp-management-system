export const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "AI Powered RFP Management API",
    "version": "1.0.0",
    "description": "API documentation for RFP creation, vendor management, proposals, and AI evaluation."
  },

  "servers": [
    {
      "url": "http://localhost:5000/api",
      "description": "Local Server"
    }
  ],

  "paths": {
    "/rfps/create": {
      "post": {
        "summary": "Create RFP",
        "tags": ["RFP"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "input": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "RFP created" }
        }
      }
    },

    "/rfps/getall": {
      "post": {
        "summary": "Get All RFPs",
        "tags": ["RFP"],
        "responses": { "200": { "description": "RFP list" } }
      }
    },

    "/rfps/sendProposalTovendor": {
      "post": {
        "summary": "Send RFP to Vendors",
        "tags": ["RFP"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "rfpId": { "type": "string" },
                  "vendorIds": { "type": "array", "items": { "type": "string" } }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Sent to vendors" }
        }
      }
    },

    "/vendors/create": {
      "post": {
        "summary": "Create Vendor",
        "tags": ["Vendor"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "email": { "type": "string" },
                  "contactInfo": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Vendor created" }
        }
      }
    },

    "/vendors/getall": {
      "post": {
        "summary": "Get Vendors",
        "tags": ["Vendor"],
        "responses": {
          "200": { "description": "Vendor list" }
        }
      }
    },

    "/proposals/getall": {
      "post": {
        "summary": "Compare Vendor Proposals",
        "tags": ["Proposals"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "rfpId": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "AI recommendations returned" }
        }
      }
    }
  }
}
