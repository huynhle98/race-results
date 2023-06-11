# race-results

- This project is using Nodejs, Express, MongoDB, Swagger and TypeScript.
- It is REST API project that displays content crawled from the F1 racing results at RACE RESULTS [formula1.com](https://www.formula1.com/en/results.html/2023/races.html)

### Documenting the REST API

- Ensure that you have [node.js](https://nodejs.org/en/) installed on your computer.(Recommended version 16.15.0).
- Suggestion: [nvm](https://github.com/nvm-sh/nvm) to manage and change node version.

#### REST API with functions:

- Search data by year (Data samples: 2023, 2022,...)
- Search data by driver (Data samples: Max Verstappen, Sergio Perez,...)
- Search data by team (Data samples: RED BULL RACING HONDA RBPT, MERCEDES,...)
- Search data by race (Data samples: Bahrain, Saudi Arabia,...)
- Race results by Year & Grand Frix(optional) (Data samples: 2023 and Saudi Arabia, 2022 and Bahrain,...)
- Race results by Year & Driver(optional) (Data samples: 2023 and Max Verstappen,...)
- Race results by Year & Team(optional) (Data samples: 2023 and Red Bull Racing Honda RBPT,...)

#### Execution method after cloning the project

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

- View the docs(Swagger) from [http://localhost:4800/docs](http://localhost:4800/docs) and try the APIs on it.
- View config mongoDB from src/mongo/env.ts and connect to it from src/services/database.service.ts
- View routes from src/routes/routers.ts

### Notes

- If the port 4800 in use, you can change it in src/index.ts
- Access [http://localhost:4800/crawl-data](http://localhost:4800/crawl-data) to crawl data and save it into the database.
- To run crawl function, you should access on disable web security browser:

```bash
start chrome.exe http://localhost:4800/crawl-data --disable-web-security --user-data-dir="D:\test"
```
