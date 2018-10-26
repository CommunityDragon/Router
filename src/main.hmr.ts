import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import DataManager from './entity/datamanager';
const cors = require('cors');
const morgan = require('morgan');

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  app.use(cors());
  app.use(morgan('combined'));
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'ejs');

  await DataManager.getInstance().loadCDNRoutes();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
