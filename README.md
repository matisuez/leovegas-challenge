# Leo Vegas Challenge

### <u>Position</u>: <i>NodeJS Engineer</i>
See the challenge from this [link](./NodeJS%20API%20test.pdf).

## Project set up

1. Install dependencies
````bash
npm install
````
2. Create .env file from .env.template
3. Build project
````bash
npm run build
````

### Development Environment
1. Run development mode
````bash
npm run dc:dev
````
2. Rebuild database with seed
````bash
curl -X GET http://localhost:3000/api/v2/seed
````

### Test Environment

1. Run tests
````bash
npm run test
````
or watch mode
````bash
npm run test:watch
````

### Tech stack
* Typescript
* ExpressJS
* Sequelize
* PostgreSQL
* Docker compose
* SQLite (testing)
* Jest & supertest