import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "path"

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
        entities: [join(__dirname, "../entities/*.entity{.ts,.js}")],
        synchronize: configService.getOrThrow("MYSQL_SYNCHRONIZE"),
        dropSchema: configService.getOrThrow("MYSQL_DROP"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
