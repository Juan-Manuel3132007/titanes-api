import { app } from './app';
import { env } from './infrastructure/config/env';

app.listen(env.port, () => {
  console.log(`API Titanes escuchando en http://localhost:${env.port}`);
});