# Node.js Tutorial: Hello World HTTP Server

## Purpose

`server.js` is a single-file HTTP server that exposes one endpoint, `GET /hello`. It is written directly against the Node.js built-in `http` module, with no dependencies of any kind, no framework and no build step.

`GET /hello` responds with status `200`, `Content-Type: text/plain` and the body `Hello world`. Every other request responds with status `404`, `Content-Type: text/plain` and the body `Not Found` — a request to an unknown path, and a request whose method is not the route's such as `POST /hello`.

## Prerequisites

Node.js v18.0.0 or later.

## Installation

No installation step is required beyond having Node.js installed. The project declares no dependencies, so there are no packages to install and nothing to fetch.

## Execution

Start the server from the project directory, either way:

```bash
node server.js
```

```bash
npm start
```

`npm start` runs the `start` script declared in `package.json`, which is `node server.js`: it is the same entry point, not a separate one. The server listens on port `3000` unless `PORT` says otherwise, as described under Configuration.

## Testing

With the server running and `PORT` unset, request the endpoint from a second terminal:

```bash
curl http://localhost:3000/hello
```

## Expected output

The command prints the response body:

```text
Hello world
```

That response carries status `200` and `Content-Type: text/plain`, and its body is `Hello world` exactly, with no trailing newline.

In the server's terminal, the startup line appears once the server is listening, and one log line is written for every incoming request — matched or unmatched:

```text
Server listening on port 3000
[2026-10-16T08:30:00.930Z] GET /hello
```

A log line is `[ISO-8601 timestamp] [HTTP method] [request path]`: an ISO-8601 UTC timestamp with millisecond precision and a trailing `Z`, then the HTTP method, then the request path. A request for an unknown path is logged the same way, next to the `404` it receives:

```text
[2026-10-16T08:30:01.104Z] GET /invalid
```

## Shutdown

Press `CTRL+C` in the server's terminal to stop it. The server logs `Shutting down server`, stops accepting connections and exits with status `0`.

## Configuration

The server reads one environment variable, `PORT`:

- Default: `3000`, used when `PORT` is unset or empty.
- Accepted values: an integer between `1024` and `65535` inclusive.
- Rejected values: anything else — a non-integer, a value below `1024`, or a value above `65535`. The server reports an actionable message on stderr and exits with a non-zero status without attempting to listen. A privileged port such as `80` is refused by the application itself, because the accepted range starts at `1024`.

To serve on another port:

```bash
PORT=4000 node server.js
```

The startup line then reads `Server listening on port 4000`, and the endpoint is at `http://localhost:4000/hello`.
