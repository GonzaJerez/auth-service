import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, DatabaseModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
