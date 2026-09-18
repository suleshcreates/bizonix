import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3001);
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const frontendOrigin = config.get<string>('FRONTEND_ORIGIN', 'http://localhost:3000');
  const adminOrigin = config.get<string>('ADMIN_ORIGIN', 'http://localhost:3000');
  const corsOrigins = config.get<string>('CORS_ORIGINS', '');

  // --- Security ---
  app.use(helmet({
    // Relax CSP in dev to avoid breaking Swagger UI
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
  }));

  app.use(cookieParser());

  // --- CORS: only configured origins, never * for authenticated routes ---
  const allowedOrigins = new Set<string>(
    [frontendOrigin, adminOrigin, ...corsOrigins.split(',')]
      .map((o) => o.trim())
      .filter(Boolean),
  );
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (server-to-server, curl, mobile)
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });

  // --- Global prefix ---
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'health/ready'],
  });

  // --- Global pipes ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // --- Global filters & interceptors ---
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
    new LoggingInterceptor(),
  );

  // --- Swagger (development only) ---
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Bizonix API')
      .setDescription('Bizonix CMS and Admin API')
      .setVersion('1.0')
      .addCookieAuth('bz_admin_access')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  console.log(`[Bizonix] Backend running on http://localhost:${port}`);
  console.log(`[Bizonix] Environment: ${nodeEnv}`);
  if (nodeEnv !== 'production') {
    console.log(`[Bizonix] Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
