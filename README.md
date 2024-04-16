# remix-turso-multitenant

This is not working for now, (15/04/2024):

- [❌] trying to migrate (or even connecting) the Turso "schema" DB with drizzle gives error 500

## Prerequesite

We should have a Turso gourp

```sh
turso group create tantilument
```

You will also have a region at that point, set theses values in the `.env`

```sh
TURSO_APP_GROUP=tantilument
APP_PRIMARY_LOCATION=sin
```

### Create the global/service database

```bash
turso db create service-db --group tantilument
turso db tokens create service-db --group tantilument
```

This will give you a token that you should put in your .env

```sh
TURSO_DB_AUTH_TOKEN=my-new-token
```

Display the URL by running that command

```sh
turso db show --url service-db
```

And store it in the .env

```sh
TURSO_DB_URL=libsql://service-db-phildl.turso.io
```

Migrate that db

```
pnpm drizzle:migrate
```

### Create the tenant database schema db

```bash
turso db create tantilument-schema-db --group tantilument --type schema
turso db show --url tantilument-schema-db
```

And store it in the .env

```sh
TURSO_SCHEMA_DB_NAME=tantilument-schema-db
TURSO_SCHEMA_DB_URL=libsql://tantilument-schema-db-phildl.turso.io
```

❌ At that point unfortunately we need to do manual migration of the schema-db

```sh
turso db shell tantilument-schema-db
```

Then manually enter the migraitons in `drizzle/migrations-tenants`

### Turso API

```sh
turso auth api-tokens mint tantilument
```

And store the token in the .env

```sh
APP_NAME=tantilument
TURSO_API_TOKEN=api-token
TURSO_API_URL=https://api.turso.tech
```
