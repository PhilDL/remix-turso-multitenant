# remix-turso-multitenant

This is not working for now, (15/04/2024):

- [❌] trying to migrate (or even connecting) the Turso "schema" DB with drizzle gives error 500

## Prerequesite

### Create the global database

```bash
turso db create shuken-multitenant
turso db tokens create shuken-multitenant --group
turso db show --url shuken-multitenant
```

Migrate that db
