const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'PATCH') {
    // Custom logic for updating data in PATCH requests
    const { countdowns, tasks } = req.body;
    if (countdowns) {
      // Update countdowns in db.json
      router.db.set('countdowns', countdowns).write();
    }
    if (tasks) {
      // Update tasks in db.json
      router.db.set('tasks', tasks).write();
    }
    res.jsonp({}); // Respond with an empty object
  } else {
    // Continue to JSON Server router
    next();
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
