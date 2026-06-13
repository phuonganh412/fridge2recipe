import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`API listening on port ${port}`, "Bootstrap");
}

bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
