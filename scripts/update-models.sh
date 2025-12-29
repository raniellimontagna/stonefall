#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY is not set. Please check your .env file."
  exit 1
fi

echo "🌐 Fetching latest Gemini models..."

# Fetch models from Gemini API
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" > models.json

if [ $? -eq 0 ]; then
  echo "✅ models.json updated successfully!"
else
  echo "❌ Failed to fetch models."
  exit 1
fi
