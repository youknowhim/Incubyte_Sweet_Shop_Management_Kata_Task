const app = require("./server");
const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

