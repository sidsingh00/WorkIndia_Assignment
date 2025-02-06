const express = require("express");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
  });
  
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
