import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictionaryUpdateDto } from 'src/dictionary/dto/dictionary-update.dto';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntriesService {
  private readonly logger = new Logger(EntriesService.name);

  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}

  getEntry(word: string): Promise<Dictionary> {
    return this.dictionaryRepository.findOneByOrFail({ word });
  }

  async updateEntry(
    word: string,
    value: DictionaryUpdateDto,
  ): Promise<Dictionary> {
    const dictionary: Dictionary = new Dictionary();
    dictionary.word = word;
    dictionary.wordMetadata = value.wordMetadata;
    return await this.dictionaryRepository.save(dictionary);
  }
}
