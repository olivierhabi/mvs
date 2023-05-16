# MyTop100Movies API Postman Collection 

To run this Node.js app, follow the steps below:

1. Install dependencies:
- `yarn install`
2. Build the application:
- `yarn run build`
2. Pushes the changes in the Prisma schema to the database:
- `yarn run db:push`
3. Start the application:
- `yarn run start`
4. Runs the tests using Mocha and generates test coverage reports:
- `yarn run test`

This collection contains endpoints for the MyTop100Movies API. It includes operations for creating, reading, updating, and deleting movies, as well as user account management and movie search functionality.

[POSTMAN COLLECTION HERE](https://documenter.getpostman.com/view/8274199/2s93eeQUka)

API URL: `https://mvs-production.up.railway.app`

## Endpoints

1. `POST /movies` - **Create a Movie**
    - Auth: Bearer Token
    - Body (raw, JSON): `{"movieId" : 19995}`

2. `GET /movies/{movieId}` - **Get a Movie by ID**
    - Auth: Bearer Token
    - Replace `{movieId}` with the actual ID of the movie.

3. `PUT /movies/{movieId}` - **Rank and Update a Movie by ID**
    - Auth: Bearer Token
    - Body (raw, JSON): `{"movieId" : 19995, "rank": 1}`
    - Replace `{movieId}` with the actual ID of the movie.
    - Description: You can change your movie rank by modifying rank variable.

4. `DELETE /movies/{movieId}` - **Delete a Movie by ID**
    - Auth: Bearer Token
    - Replace `{movieId}` with the actual ID of the movie.

5. `GET /movies` - **Get All Movies**
    - Auth: Bearer Token

6. `POST /auth/signup` - **Create Account**
    - Body (raw, JSON): `{"email": "your-email@example.com", "password": "your-password"}`

7. `POST /auth/login` - **Login**
    - Body (raw, JSON): `{"email": "your-email@example.com", "password": "your-password"}`

8. `POST /movies/search?query={query}` - **Search Movie by Name**
    - Replace `{query}` with the actual name of the movie.

9. `GET /` - **MyTop100Movies Home**

## Auth

For endpoints requiring authentication, a Bearer token is required. This token will be provided upon successful login.

