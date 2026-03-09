// Mock the database connection for all tests
jest.mock("../src/db/connection", () => ({
  db: {
    query: jest.fn(),
  },
}));

// Clean up after all tests
afterAll(async () => {
  jest.clearAllMocks();
});
