# BC.Public

The public-facing intake apps: the forms people fill in without signing in, and the APIs behind
them. Each app writes into a database owned by **BC.Internal** (the LAN-only staff app), which
defines the schema through its migrations. This repo never changes a schema.

The interface between the two is the **intake contract** in the BC Internal architecture doc
(PHC section → "Public intake contract"): endpoints, field rules, what the public app writes,
and the SQL permissions its login gets. A change to the contract is a change to both repos.

## What's here

```
BC.Public/
├─ BC.Public.Api/            .NET solution (Visual Studio)
│  ├─ BC.Public.sln
│  ├─ Directory.Build.props  shared build settings (warnings are errors)
│  └─ src/app/Phc/           BC.Public.Phc: Project Homeless Connect API → /api/phc, port 5201
└─ BC.Public.Web/            the public forms (not started); OpenAPI files land in openapi/
```

- No code is shared with BC.Internal. Small helpers that both need (such as the date mapping for
  Access compatibility) are copied, with a comment saying where the original lives.
- The public SQL login's GRANT scripts live in BC.Internal (`db/Phc/security`), with the
  database they belong to.

## Running the PHC API locally

1. Open `BC.Public.Api/BC.Public.sln` in Visual Studio and build.
2. In `src/app/Phc/appsettings.Development.json`, set the connection string's server to your
   local SQL Server with `BC_Phc` (created by BC.Internal's migrations).
3. In the internal app, give a PHC project an application window that includes now.
4. Run the **http** profile (http://localhost:5201).
5. Use `src/app/Phc/BC.Public.Phc.http`: load the form, wait 3 seconds, submit.
   Confirmation emails are written to `C:\temp\phc-mail` as `.eml` files in development.

## Configuration

Shared settings are in `appsettings.json`; local ones in `appsettings.Development.json`.
Server values (connection string, `Email:FromAddress`, `DataProtection:KeysPath`) go in
`appsettings.Production.json` on the server only; it's in `.gitignore`. The app won't start
without `Email:FromAddress` and `Phc:AgreementsVersion`.

## Conventions

The same as BC.Internal: every file starts with a comment saying what it's for; package versions
are pinned; `src/app/<app>/<Feature>` per app; code moves into a shared `src/lib` only once a
second app needs it.
