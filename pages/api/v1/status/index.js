import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const versionResult = await database.query("SHOW server_version;");
  const databaseVersion = versionResult.rows[0]?.server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(
    maxConnectionsResult.rows[0]?.max_connections,
    10,
  );

  // Used connections can be obtained from pg_stat_activity or pg_stat_database
  const databaseName = process.env.POSTGRES_DB;
  const usedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_catalog.pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const usedConnections = usedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        database_version: databaseVersion,
        max_connections: maxConnections,
        used_connections: usedConnections,
      },
    },
  });
}

export default status;
