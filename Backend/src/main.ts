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
		.setTitle('Discord Clone Api')
		.setDescription('This is the api for bringo app')
		.setVersion('1.0')
		.addTag('discord')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(5000, () => {
		console.log('Listening on port 127.0.0.1:5000');
	});
}
bootstrap();
