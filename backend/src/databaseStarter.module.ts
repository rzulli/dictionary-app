import { Module, OnModuleInit, Logger, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictionary } from './dictionary/entities/dictionary.entity';
import { HttpModule } from '@nestjs/axios';
import { chunk } from 'lodash';

@Injectable()
export class DatabaseStarterService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseStarter.name);
  private readonly URL = process.env.STARTUP_FILE;

  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    try {
      if ((await this.dictionaryRepository.count()) > 0) {
        this.logger.log(
          'Using previous cached data. Clear dictionary in order to download again.',
        );
        return;
      }

      this.logger.log(`Downloading JSON from ${this.URL}`);
      const response = await firstValueFrom(this.httpService.get(this.URL));
      const words = Object.keys(response.data);

      this.logger.log(`Inserting ${words.length} words into the database`);

      for (const wordsChunk of chunk(words, 1000)) {
        await this.dictionaryRepository
          .createQueryBuilder()
          .insert()
          .into(Dictionary)
          .values(wordsChunk.map((word) => ({ word })))
          .orIgnore()
          .execute();
      }

      this.logger.log(`Database populated with ${words.length} words`);
    } catch (error) {
      this.logger.error('Failed to populate database', error);
    }
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary]), HttpModule],
  providers: [DatabaseStarterService],
})
export class DatabaseStarter {}
