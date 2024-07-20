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
1. Run server
````bash
npm run dev
````
2. Run database
````bash
npm run dc:dev
````
3. Populate database with seed
````bash
curl -X GET http://localhost:3000/api/v2/seed
````
or
````bash
// From swagger api
http://localhost:3000/api/docs/#/Seeds/createSeeds
````
4. Database migrations
````bash
npx prisma migrate dev
````
or
````bash
npx db push
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
* Prisma ORM
* PostgreSQL
* Docker compose
* Neon (testing)
* Jest & supertest