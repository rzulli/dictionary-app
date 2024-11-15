import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DictionaryUpdateDto } from 'src/dictionary/dto/dictionary-update.dto';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { User } from 'src/user/entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

@Injectable()
export class EntriesService {
  private readonly logger = new Logger(EntriesService.name);

  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
    private readonly httpService: HttpService,
  ) {}

  async search(
    search = '',
    limit: number = 2,
    previous = null,
    after = null,
    page = 0,
  ): Promise<Object> {
    this.logger.debug(
      'Searching ' +
        search +
        ' ' +
        limit +
        ' - prev:' +
        previous +
        ' - next:' +
        after,
    );
    const queryBuilder = this.dictionaryRepository
      .createQueryBuilder('dictionary')
      .where('dictionary.word like :search', { search: `%${search}%` });

    const paginator = buildPaginator({
      entity: Dictionary,
      paginationKeys: ['word'],
      query: {
        order: 'ASC',
        limit: Number(limit),
        afterCursor: after,
        beforeCursor: previous,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const response = {
      results: data,
      totalDocs: (await queryBuilder.getManyAndCount())[1],
      next: cursor.afterCursor,
      previous: cursor.beforeCursor,
      hasNext: cursor.afterCursor != null,
      hasPrev: cursor.beforeCursor != null,
      limit: Number(limit),
    };
    this.logger.debug(response);
    return response;
  }

  getCachedEntry(word: string): Promise<Dictionary> {
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

  async getEntry(word: string): Promise<Dictionary> {
    this.logger.log('/:word/ Recuperando ' + word);
    const cache = await this.getCachedEntry(word).catch((e) => {
      throw new HttpException('Palavra não encontrada', HttpStatus.NOT_FOUND);
    });

    if (!cache.wordMetadata) {
      this.logger.log(
        'Metadata não encontrado. Requisitando da API. ' +
          process.env.DICTIONARY_API +
          word,
      );
      try {
        const metadata = await firstValueFrom(
          this.httpService.get(process.env.DICTIONARY_API + word),
        );
        const newDictionary = new DictionaryUpdateDto();
        newDictionary.wordMetadata = metadata.data;
        newDictionary.word = word;
        this.logger.log('Updating ' + word);
        return this.updateEntry(word, newDictionary);
      } catch (e) {
        this.logger.error(
          'Erro ao recuperar metadata ' +
            process.env.DICTIONARY_API +
            word +
            ' ' +
            JSON.stringify(e.status),
        );

        return cache;
      }
    }
    this.logger.log('Cache hit');
    return new Promise((resolve) => resolve(cache));
  }
}
