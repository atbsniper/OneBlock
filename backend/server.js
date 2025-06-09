const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 8000;

// For serverless deployments, we export the app
// For traditional deployments, we start the server
if (require.main === module) {
  // This file was run directly, start the server
  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
}

// Export for serverless deployments (Railway, Vercel, etc.)
module.exports = app;
