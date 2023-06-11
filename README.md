# race-results

- A REST API that displays content crawled from the F1 racing results at RACE RESULTS [formula1.com](https://www.formula1.com/en/results.html/2023/races.html)

- This project is using Nodejs, Express, MongoDB, Swagger and TypeScript.

### REST API:

- Search data by year
- Search data by driver
- Search data by team
- Search data by race
- Race results by Year & Grand Frix(optional)
- Race results by Year & Driver(optional)
- Race results by Year & Team(optional)

### Documenting the REST API

- Ensure that you have [node.js](https://nodejs.org/en/) installed on your computer.(Recommended version 16.15.0).
- Suggestion: [nvm](https://github.com/nvm-sh/nvm) to manage and change node version.

#### Execution method after clone the project

- Install the dependencies

```bash
npm install or npm ci
```

- Start the development server (This command itself is configured to dynamically update swagger file)

```bash
npm run dev
```

- Build the project

```bash
npm run build
```

- Update swagger file

```bash
npm run build
```

- View the docs(Swagger) from [http://localhost:4800/docs](http://localhost:4800/docs) and try the APIs on it
- View config mongoDB from src/mongo/env.ts and connect to it from src/services/database.service.ts
- View routes from src/routes/routers.ts

### Notes

- If the port 4800 in use, you can change it in src/index.ts
