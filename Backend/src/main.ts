import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');

	const config = new DocumentBuilder()
		.setTitle('Bringo Api')
		.setDescription('This is the api for bringo app')
		.setVersion('1.0')
		.addTag('bringo')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(5000, () => {
		console.log('Listening on port 5000');
	});
}
bootstrap();
