// server-architect.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// API Key middleware
app.use((req, res, next) => {
  const apiKey = req.header('x-api-key') || req.header('X-API-KEY');
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Architect Server is working!' });
});

// GPT Architect endpoint
app.post('/gptArchitect', (req, res) => {
  try {
    const { action, payload } = req.body;

    if (!action || !payload) {
      return res.status(400).json({
        error: "Missing required fields: 'action' and 'payload' are required"
      });
    }

    switch (action) {
      case 'generateArchitecture':
        const { gptPurpose, targetUsers, coreFeatures, integrationNeeds } = payload;
        return res.json({
          framework: {
            systemComponents: {
              purpose: gptPurpose,
              users: targetUsers,
              features: coreFeatures,
              integrations: integrationNeeds
            }
          }
        });

      case 'createSystemPrompt':
        const { role, expertise, constraints, conversationStyle } = payload;
        return res.json({
          systemPrompt: {
            role: role,
            expertise: expertise,
            constraints: constraints,
            style: conversationStyle
          }
        });

      default:
        return res.status(400).json({
          error: `Invalid action: ${action}`
        });
    }
  } catch (error) {
    console.error("Error in /gptArchitect:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Architect Server running on port ${PORT}`);
});