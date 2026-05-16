import app from './app.js';
import { connectDatabase } from './config/database.js';
import { syncModels } from './models/index.js';

const port = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await connectDatabase();
    await syncModels();

    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

startServer();
