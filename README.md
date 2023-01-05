# E-Commerce App REST-API

Hello again!! Welcome to my personal first RESTful API project, a E-Commerce clone with CRUD endpoints and authentication included. This time I used the Express.js framework for the server, bcrypt and passport.js for the authentication and node-postgres for the connection with the database.

---

Thank you for joining me in my coding journey!!

## Dependencies

- bcrypt
- cors
- dotenv
- express
- express-session
- passport
- passport-local
- pg

### Description

This is a CRUD API where people can make calls to different endpoints to manipulate a database and mock a little e-commerce application.

### Setup

1. Run `npm install` so every dependency in the package.json file installs correctly.
2. Pass the correct information to the .env, config, dbConfing and databaseSetup files to connect the program with a database.
3. Run `node databaseSetup` to create the necessary tables for the API to work with.
4. Run `npm run dev` to start the server so the endpoints become available.
