const app = require('./app');
const port = 3000;
const db = require('./database');

const routes = require('./routes');
routes(app);

app.listen(port, () => console.log(`App listening on http://localhost:${port}/`));
