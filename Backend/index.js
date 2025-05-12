
const dotenv = require('dotenv');
const app = require('./src/app');
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});