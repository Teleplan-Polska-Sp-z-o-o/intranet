# Reconext Intranet: Workplace Efficiency

Reconext Intranet leverages a unified technological ecosystem, seamlessly integrating TypeScript with Node.js for backend operations and Vue.js for frontend interfaces. This cohesive approach fosters synergy between backend and frontend development, streamlining communication and enhancing collaboration. By adopting modern technologies and libraries like Vuetify for UI components, Vue Router for navigation, Axios for HTTP requests, and Pinia for state management, Reconext Intranet ensures a robust and efficient platform, delivering an intuitive user experience and empowering organizational productivity.

## Table of Contents

- [Installation](#installation)
  - [Server Requirements](#server-requirements)
  - [Pre-run Steps](#pre-run-steps)
  - [Run Docker Containers](#run-docker-containers)
- [Development](#development)
- [API](#api)

## Installation

### Server Requirements

1. **Ensure that your server meets the following requirements:**
   - Docker Engine with Docker Compose or Docker Desktop installed: Docker provides containerization for seamless deployment.
   - Git installed: Git is necessary for cloning the project repository.
   - Node.js installed: Node.js is required for running the project's backend and frontend.

### Pre-run Steps

1. Clone the project repository by running the following command in your desired server directory:

   ```bash
   git clone https://github.com/MaciejZab/node-vue-postgres.git
   ```

2. Navigate to the project `root` directory and rename 'toAdjust.env' file to '.env', then configure settings according to your requirements.

3. Navigate to the project `/vue/src/config` directory and adjust 'env.ts' file according to your '.env' settings.

4. Install Dependencies: Run the following command in both the `/vue` and `/node` directories to install project dependencies:

   ```bash
   npm install
   ```

5. After installing dependencies, build the Vue.js frontend and Node.js backend by running the following command in both the `/vue` and `/node` directories:

   ```bash
   npm run build
   ```

### Run Docker Containers

1. Build the Docker containers by running in the project's root directory:

   ```bash
   docker-compose up -d --build
   ```

## Development

To facilitate seamless development, it's important to note that Vue and Node applications behave differently in terms of reloading changes during development.

1. First modify the source code within the `/node` and/or `/vue` directory.
2. Rebuild Node and/or Vue application source code into JavaScript by running the following command in the `/vue` and/or `/node` directory:

   ```bash
   npm run build
   ```

3. At this point, changes made to the Vue application are reflected in the browser.

4. Unlike the Vue application, the Node application requires one additional step. To reflect modifications in the Node application, it's necessary to rebuild the container for this service. To achieve this, navigate to the root directory and run the following command:

   ```bash
   docker-compose up -d --build node
   ```

5. Once the Node service is rebuilt, changes are reflected.

### GitHub

1. Check the status:

   ```bash
   git status
   ```

   It will show which files have been modified or confirm that the changes have been staged (2.).

2. Add changes to the staging area:

   ```bash
   git add .
   ```

   Or add specific files by replacing '.' with the filenames.

3. Commit the changes:

   Once you've staged the changes, commit them with a descriptive message.

   ```bash
   git commit -m "Your descriptive commit message here"
   ```

   Note: Staging changes is possible also via IDE.

4. Push the changes:

   Note: Fetching and pulling before pushing might be necessary (check GitHub documentation).

   Note: Check if remote repository has been added (git remote -v).

   ```bash
   sudo git push origin
   ```

   Now enter GitHub username and key instead of password.

## API

To access exposed endpoints, you need to include an API key in the query parameters of your request. Here's how you can use the API key query parameter:

- **Parameter Name:** `api-key`
- **Example:** `http://your-domain.com/api/endpoint?api-key=your-api-key`

The API key serves as an authentication mechanism for authorized access. Securely store and manage it to prevent unauthorized use.

### Endpoints

## Database

**Choice:** PostgreSQL

- Robust, open-source relational database known for performance, reliability, and feature richness.
- Excellent support for ACID transactions and data integrity.
- Ideal for complex data models and high-volume applications.

### Object-Relational Mapping (ORM): TypeORM

**Docs:** [TypeORM](https://typeorm.io/)

- Simplifies database interactions by bridging the gap between object-oriented models and relational databases.
- Reduces boilerplate code for CRUD operations and data transformations.
- Offers convenient connection management and query building capabilities.

#### Migrations

Migrations are a way to manage database schema changes over time. Their purpose is to keep track of changes to the database structure in a consistent and reversible manner.

To **create a migration** run the following command within the `/node` directory:

```bash
npm run typeorm migration:create ./src/orm/migrations/migrationName
```

There are two methods you must fill with your migration code: `up` and `down`. up has to contain the code you need to perform the migration. down has to revert whatever up changed. down method is used to revert the last migration.

To **create/update database schema** run the following command within the `/node` directory:

```bash
   npm run typeorm migration:run -- -d ./src/config/orm/dataSource.ts
```

To **revert database schema** run the following command within the `/node` directory:

```bash
   npm run typeorm migration:revert -- -d ./src/config/orm/dataSource.ts
```

Migrations are stored in the directory specified by the `migrations` option in `node/src/config/orm/dataSource.ts`. The configuration looks like this:

migrations: [`${__dirname}/../../orm/migrations/*Migration.ts`]

#### Entities

Due to compilation incapability to resolve some TypeScript keywords, it's crucial not to add decorators like `@Entity()` or `@Column()` directly to classes in the `node/src/models` directory. Instead, create copies in the `node/src/orm/entities` directory with decorators.

Entities, which represent models used for database queries, are stored in a directory specified by the `entities` option in `node/src/config/orm/dataSource.ts`. The configuration for entities looks like this:

entities: [`${__dirname}/../../orm/entity/**/*Entity.js`]
