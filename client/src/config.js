export const API_HOST = process.env.REACT_APP_USE_STAGING_API
  ? "http://localhost"
  : "http://127.0.0.1:8000";

export const MPI_HOST = process.env.MONGO_USE_API
  ? "mongodb://localhost:27017"
  : "mongodb://localhost:27017";
