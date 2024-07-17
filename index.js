import initMongoDBConnection from "./db/initMongoDBConnection.js";
import startServer from "./app.js";

const bootstrap = async () => {
  await initMongoDBConnection();
  startServer();
};

bootstrap();
