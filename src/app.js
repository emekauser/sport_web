const express = require("express");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const port = process.env.PORT || 3000;
require("./db/db");
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(adminRouter);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
