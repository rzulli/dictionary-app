import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';

import { HttpModule } from '@nestjs/axios';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Dictionary])],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
