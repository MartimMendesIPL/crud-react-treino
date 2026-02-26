import { createApp } from './app.js';

const PORT = process.env.PORT ?? 5000;

const start = async (): Promise<void> => {
  try {
    const app = await createApp();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`AdminJS panel at http://localhost:${PORT}/admin`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
