require("dotenv").config();

const app = require("./app");
const port = process.env.NODE_PORT || 3000;
require("./database");
require("./redis/blocklist");
require("./redis/allowlist-refresh-token");

const routes = require("./routes");
routes(app);

app.listen(port, () =>
  console.log(`App listening on http://localhost:${process.env.NODE_PORT}/`)
);
