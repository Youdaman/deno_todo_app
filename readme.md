# Deno Todo App

This is a simple Todo app built with Deno, Hono, and MongoDB. The app allows you
to create, update, toggle, and delete todos. It uses Docker Compose to run the
application and MongoDB in separate containers.

## Prerequisites

Make sure you have the following installed on your system:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

Follow these steps to run the app:

### 1. Clone the Repository

```bash
git clone https://github.com/youdaman/deno_todo_app.git
cd deno_todo_app
```

### 2. Start the Application

Run the following command to start the app using Docker Compose:

```bash
docker-compose up --build
```

This will:

- Build the `deno-app` container
- Start the `deno-app` container and the `mongo` container

### 3. Access the App

Once the containers are running, you can access the app in your browser at:

```
http://localhost:3000
```

### 4. Stopping the Application

To stop the app, press `Ctrl+C` in the terminal where Docker Compose is running,
or run:

```bash
docker-compose down
```

This will stop and remove the containers.

## Project Structure

- **`main.ts`**: The main application file that defines the API routes and
  connects to MongoDB
- **`index.html`**: The frontend of the Todo app
- **`docker-compose.yml`**: The Docker Compose configuration file
- **`readme.md`**: This file

## Environment Variables

The app uses the following environment variables:

- `DENO_ENV`: Set to `development` by default in `docker-compose.yml`

You can modify these variables in the `docker-compose.yml` file if needed.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure the `mongo` container is running
   - Check the logs of the `mongo` container:
     ```bash
     docker-compose logs mongo
     ```

2. **Port Already in Use**:
   - Make sure port `3000` (for the app) and `27017` (for MongoDB) are not being
     used by other processes

3. **Rebuilding the Containers**:
   - If you make changes to the code, rebuild the containers:
     ```bash
     docker-compose up --build
     ```
