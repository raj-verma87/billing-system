// server.js
const app = require('./app');

const PORT = process.env.PORT || 3000;
console.log("port:",PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
