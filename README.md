# Certification

A Node.js/Express backend that serves a certification web application: it renders templated HTML (via Swig) for authentication and certification flows, proxies API calls, and issues JWTs for session handling.

## Tech Stack

- Node.js, Express ~4.15
- Swig (server-side HTML templating)
- express-session, cookie-parser, body-parser
- jsonwebtoken (JWT auth)
- nodemailer, multer, express-http-proxy, request

## Prerequisites

- Node.js (works with older Node LTS versions given the ~2018-era dependency pins; Node 14 is a safe bet)

## Installation

```bash
npm install
```

## Configuration

Server settings live in `config/config.json`:

```json
{
  "port": 3000,
  "baseHeader": "http://localhost:8000/",
  "tokenSecretKey": "..."
}
```

`baseHeader` should point at the running `certificationAPI` backend.

## Running

```bash
npm start
```

Runs `node ./bin/www`, which starts the server on the port configured in `config/config.json` (default `3000`). An HTTPS entry point is also available at `bin/www_https`.

## Project Structure

```
app.js                 Express app setup (middleware, view engine, routes, error handling)
bin/www, bin/www_https Server entry points (HTTP / HTTPS)
config/config.json     Port, API base URL, JWT secret
routes/                login.js, apiCall.js, certification.js
applications/          Swig view templates (development/production, authentication, certification)
public/                Static assets
```
