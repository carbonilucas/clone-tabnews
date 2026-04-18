test("GET to /api/v1/status should return 200", async () => {
  // Arrange
  const url = "http://localhost:3000/api/v1/status";

  // Act
  const response = await fetch(url);
  const responseBody = await response.json();

  // Assert
  expect(response.status).toBe(200);

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(responseBody.dependencies.database.database_version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.used_connections).toEqual(1);
});
