#!/bin/bash

curl \
	-X POST \
	-H "Content-Type: application/json" \
	-d '{
      "class": "MultiModal",
      "moduleConfig": {
          "multi2vec-clip": {
              "imageFields": [
                  "image"
              ]
          }
      },
      "vectorIndexType": "hnsw",
      "vectorizer": "multi2vec-clip",
      "properties": [
        {
          "dataType": [
            "string"
          ],
          "name": "filename",
          "description": "filename of the image"
        },
        {
          "dataType": [
              "blob"
          ],
          "name": "image",
          "description": "image"
        }
      ]
    }' \
	http://localhost:8080/v1/schema
