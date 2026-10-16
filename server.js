/** Minimal Node.js HTTP server exposing GET /hello plus a 404 catch-all. */
const http = require('http');

const DEFAULT_PORT = 3000;
const MIN_PORT = 1024;
const MAX_PORT = 65535;

// The route table and the catch-all entry: matched on method and on the path portion.
const ROUTES = [{ method: 'GET', path: '/hello', status: 200, body: 'Hello world' }];
const NOT_FOUND = { status: 404, body: 'Not Found' };

/** Port policy: PORT when set, else 3000; the 1024-65535 range is enforced here. */
function resolvePort() {
  const raw = process.env.PORT;
  if (raw === undefined || raw === '') {
    return DEFAULT_PORT;
  }
  const port = Number(raw);
  if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT) {
    console.error(
      `Invalid PORT "${raw}": expected an integer between ${MIN_PORT} and ${MAX_PORT}. ` +
        'Unset PORT or set it to a value in that range.'
    );
    process.exit(1);
  }
  return port;
}

/** One line per request: "[ISO-8601 timestamp] METHOD request-target". */
function logRequest(req) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
}

/** Match method and path against the defined routes, falling back to the 404 entry. */
function resolveRoute(method, path) {
  return ROUTES.find((route) => route.method === method && route.path === path) ?? NOT_FOUND;
}

/** Log the request before routing it, then write the plain-text response. */
function handleRequest(req, res) {
  logRequest(req);
  const path = req.url.split('?')[0];
  const { status, body } = resolveRoute(req.method, path);
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.end(body);
}

/** A failed bind arrives as an 'error' event; report it and exit non-zero. */
function handleBindError(err, port) {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Stop the process holding it or set PORT to a free port.`
    );
  } else {
    console.error(`Server failed to start: ${err.message}`);
  }
  process.exit(1);
}

/** Stop accepting connections and exit with status 0 once the server has closed. */
function handleShutdown(server) {
  console.log('Shutting down server');
  server.close(() => process.exit(0));
}

/** Resolve the port, start listening and register the shutdown handler. */
function start() {
  const port = resolvePort();
  const server = http.createServer(handleRequest);

  server.on('error', (err) => handleBindError(err, port));
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  process.on('SIGINT', () => handleShutdown(server));
}

start();
