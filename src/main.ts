import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: 'fa34dj60h78qeklç8ç324j9w-3443sdl77ãda76ihprtfdtry3-e93829cs=sd-=f-=dsn56mb7k8dh9gfdjf9das0sdjasojdla73',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000
      }
    })
  )
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3306);
}
bootstrap();
