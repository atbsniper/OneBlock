const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 8000; // Fallback if Railway doesn't provide one

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
