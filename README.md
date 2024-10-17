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
   git clone https://github.com/Teleplan-Polska-Sp-z-o-o/intranet.git
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

### How to mount a directory

1. Create a New Mount Point: If you want to mount the directory at a different location (e.g., /home/bydintranet/intranet/node/mnt), first create the directory:

   ```bash
   mkdir -p /home/bydintranet/intranet/node/mnt
   ```

2. Mount the Directory to the New Location: Use the following command to mount the remote CIFS directory to the new local path:

   ```bash
   sudo mount -t cifs "//Your File Server IP/Your Path" /home/bydintranet/intranet/node/mnt -o username="BYD-Intranet",password="0mGdeTVK5M",vers=3.0
   ```

3. Make the Mount Persistent (optional): To ensure that this mount is remounted automatically after a reboot, add the following entry to your /etc/fstab file:

   - Open the /etc/fstab file:

   ```bash
   sudo nano /etc/fstab
   ```

   - Add this line:

   ```bash
   //Your File Server IP/Your Path /home/bydintranet/intranet/node/mnt cifs username=BYD-Intranet,password=0mGdeTVK5M,vers=3.0 0 0
   ```

4. Verify the Mount: After mounting, check the contents of the directory to ensure everything is correctly mounted:

   ```bash
   ls /home/bydintranet/intranet/node/mnt
   ```

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

5. List all branches:

   ```bash
   sudo git branch -a
   ```

6. Switch to an existing branch:

   Note: Replace <branch_name> with the name of the branch you want to switch to.

   ```bash
   sudo git checkout <branch_name>
   ```

7. Create and switch to a new branch:

   Note: Replace <new_branch> with the name of the new branch.

   ```bash
   sudo git checkout -b <new_branch>
   ```

8. Merge the specified branch into the current branch:

   Note: Replace <source_branch> with the name of the branch you want to merge into <target_branch>. Ensure you are on the branch you want to merge into.

   ```bash
   sudo git merge <source_branch>
   ```

   Note: Ensure to push your changes after resolving conflicts.

## API

### Headers

To access API endpoints, include the JWT in the `Authorization` header of your requests:

- **Header Name:** `Authorization`
- **Header Value:** `Bearer <your-jwt-token>`

  ```http
   GET /api/protected-endpoint HTTP/1.1
   Host: your-domain.com
   Authorization: Bearer your-jwt-token
  ```

### User Session Management

Reconext Intranet uses JWT (JSON Web Token) for user authentication and session management. When a user logs in, a JWT is issued, which must be included in subsequent API requests.

1. **JWT Verification**: The middleware verifies the JWT token provided in the `Authorization` header of each request.

2. **Session Tracking**: `UserSessionManager` manages active user sessions by automatically logging out inactive users after a specified timeout.

3. **Automatic Timeout**: If the user is inactive for a period longer than the configured timeout, they will be automatically removed from the active session list.

4. **Session Extension**: Each valid API request extends the user's session by resetting the timeout duration.

5. **Container Changes Trigger Removal**: When the application container is updated or restarted, all active sessions are cleared, ensuring that users are logged out and required to reauthenticate upon reconnecting.

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
npm run typeorm migration:create ./src/orm/migrations/<migrationName>
```

There are two methods you must fill with your migration code: `up` and `down`. up has to contain the code you need to perform the migration. down has to revert whatever up changed. down method is used to revert the last migration.

To **create/update database schema** run the following command within the `/node` directory:

```bash
   npm run typeorm migration:run -- -d ./src/config/dataSource.ts
```

To **revert database schema** run the following command within the `/node` directory:

```bash
   npm run typeorm migration:revert -- -d ./src/config/dataSource.ts
```

Migrations are stored in the directory specified by the `migrations` option in `node/src/config/dataSource.ts`. The configuration looks like this:

migrations: [`${__dirname}/../../orm/migrations/*Migration.ts`]

#### Entities

Due to compilation incapability to resolve some TypeScript keywords, it's crucial not to add decorators like `@Entity()` or `@Column()` directly to classes in the `node/src/models` directory. Instead, create copies in the `node/src/orm/entities` directory with decorators.

Entities, which represent models used for database queries, are stored in a directory specified by the `entities` option in `node/src/config/orm/dataSource.ts`. The configuration for entities looks like this:

entities: [`${__dirname}/../../orm/entity/**/*Entity.js`]
