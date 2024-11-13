import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { Public } from 'src/auth/const/const';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { DictionaryUpdateDto } from 'src/dictionary/dto/dictionary-update.dto';

@Controller('entries/en')
export class EntriesController {
  private readonly logger = new Logger(EntriesController.name);

  constructor(
    private readonly entriesService: EntriesService,
    private readonly httpService: HttpService,
  ) {}

  @Public()
  @Get(':word')
  async getEntry(@Param('word') word: string): Promise<Dictionary> {
    this.logger.log('Recuperando ' + word);
    const cache = await this.entriesService.getEntry(word).catch((e) => {
      throw new NotFoundException('Palavra não encontrada');
    });

    if (!cache.wordMetadata) {
      this.logger.log('Metadata não encontrado. Requisitando da API');
      const metadata = await firstValueFrom(
        this.httpService.get(process.env.DICTIONARY_API + word),
      );
      const newDictionary = new DictionaryUpdateDto();
      newDictionary.wordMetadata = metadata.data;
      newDictionary.word = word;
      this.logger.log('saving ' + JSON.stringify(newDictionary));
      return this.entriesService.updateEntry(word, newDictionary);
    }
    this.logger.log('Cache hit');
    return cache;
  }
}
