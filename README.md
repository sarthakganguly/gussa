# Mindful Journal

A secure, full-stack journaling application designed for mindfulness and reflection. This application provides a simple and elegant interface for users to log their thoughts, which are then shared on a communal dashboard.

Built with a modern technology stack and fully containerized with Docker for easy setup and deployment.

## Features

- **Secure User Authentication:** Complete user registration and login system.
- **Password Reset:** A secure "forgot password" flow that sends a unique reset link via email.
- **JWT-Based Sessions:** User sessions are managed securely using JSON Web Tokens.
- **Journal Logging:** Authenticated users can create and save new journal entries.
- **Communal Dashboard:** The main dashboard displays a real-time feed of the latest journal entries from all users.
- **Fully Containerized:** The entire application stack (React frontend, Node.js/Express backend, and PostgreSQL database) is managed with Docker and Docker Compose.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** bcrypt (for password hashing), JSON Web Token (JWT)
- **Emailing:** Nodemailer (for password reset emails)
- **Containerization:** Docker, Docker Compose
- **TypeScript:** Used across the entire stack for type safety and improved developer experience.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to get the application running locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mindful-journal
```

### 2. Configure Environment Variables

The application requires a set of environment variables to run. These include database credentials and a secret key for signing tokens.

- Make a copy of the example environment file:
  ```bash
  cp .env.example .env
  ```
- Open the newly created `.env` file and replace the placeholder values with your own configuration. See the **Environment Variables** section below for a detailed explanation of each variable.

### 3. Build and Run with Docker Compose

Once your `.env` file is configured, you can build and start the entire application stack with a single command:

```bash
docker-compose up --build
```

- The `--build` flag tells Docker Compose to build the application image from the `Dockerfile` on the first run or if any changes have been made to the application code.
- This command will start the application server, the database, and display the logs from both services in your terminal.

### 4. Access the Application

Once the containers are running, you can access the Mindful Journal application in your web browser at:

- **Application URL:** [http://localhost:3001](http://localhost:3001)

If you need to connect to the PostgreSQL database directly from your local machine (e.g., using a tool like DBeaver or pgAdmin), you can connect to it at:

- **Database Host:** `localhost`
- **Database Port:** `5432`

## Environment Variables

| Variable       | Description                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------|
| `APP_URL`      | The base URL of the application. Used for creating absolute links in password reset emails.               |
| `DB_HOST`      | The hostname of the PostgreSQL server. Should be `db` when running with Docker Compose.                 |
| `DB_PORT`      | The port the PostgreSQL server is running on. Default is `5432`.                                        |
| `DB_USER`      | The username for your PostgreSQL database.                                                              |
| `DB_PASSWORD`  | The password for your PostgreSQL database.                                                              |
| `DB_NAME`      | The name of the database to use.                                                                        |
| `JWT_SECRET`   | A long, random, and secret string used for signing JSON Web Tokens. This is critical for security.      |
| `DEBUG_MODE`   | Set to `true` to enable more detailed logging for debugging purposes.                                     |

## Project Structure

```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.ts         # Main entry point for the Express server
└── src
    ├── components/     # Reusable React components
    ├── contexts/       # React contexts (e.g., AuthContext)
    ├── pages/          # Page-level components
    ├── server/         # Backend-specific code
    │   ├── auth/       # Authentication logic and routes
    │   ├── db.ts       # Database connection and initialization
    │   └── logRoutes.ts# API routes for logs
    └── ...
```
