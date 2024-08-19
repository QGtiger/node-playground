import express from "express";
import lodash from "lodash";

const app = express();
const port = 3111;

app.get("/", (req, res) => {
  res.send("Welcome to a WebContainers app! 🥳");
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
