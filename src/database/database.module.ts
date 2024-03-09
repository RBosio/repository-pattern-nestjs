import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: "mysql",
        port: 3306,
        username: configService.getOrThrow("MYSQL_USER"),
        password: configService.getOrThrow("MYSQL_PASSWORD"),
        database: configService.getOrThrow("MYSQL_DATABASE"),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow("MYSQL_SYNCHRONIZE"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
