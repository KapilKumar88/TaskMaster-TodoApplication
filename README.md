# TaskMaster-TodoApplication

## Project Structure

- `server` folder contains the backend of the application
- `client` folder contains the frontend of the application

## Project setup Instructions

1. Clone the repository with git clone command.

### - Server

2. Copy `.env.example` file to `.env`.
3. Run the `npm install` command if environment is `local`.
   In `production` run command `npm install --production`
4. To run project with nodemon run command `npm run start:dev`
5. Check API documentation on `http://localhost:3000/api-docs`
6. To seed some data use the command `npm run db:seed` in the server folder

### - Client

6. Copy `.env.example` file to `.env`.
7. Run the `npm install` command.
8. To run project run command `npm run dev`
9. Check API documentation on `http://localhost:5173`

## Some Points about project

### - server related

1. Swagger Documentation for API's.
2. Unit testing of components using `jest` framework.
3. Access token generation using `jsonwebtoken`.
4. For Email nodemailer is implemented.
5. For validating the input data `joi` validator is used.
6. Mongodb is used as database.
7. `winston` is used as logger.

### - client related

1. Redux is used for the state management
2. RTK query is used for the api calls
3. Redux persist is used to persist and rehydrate the Redux store across page reloads or browser sessions.
4. For routing react-router-dom has been used in the application
5. For UI shadcn UI is used