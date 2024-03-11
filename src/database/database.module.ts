import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "path"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        url: configService.getOrThrow("MYSQL_URI"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
