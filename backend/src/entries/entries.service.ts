import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictionaryUpdateDto } from 'src/dictionary/dto/dictionary-update.dto';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { getConnection, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

@Injectable()
export class EntriesService {
  private readonly logger = new Logger(EntriesService.name);

  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}

  async search(
    search = '',
    limit = 10,
    previous = null,
    after = null,
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
        limit: limit,
        order: 'ASC',
        afterCursor: after,
        beforeCursor: previous,
      },
    });

    // Pass queryBuilder as parameter to get paginate result.
    const { data, cursor } = await paginator.paginate(queryBuilder);

    const response = {
      results: data,
      totalDocs: await queryBuilder.getCount(),
      next: cursor.afterCursor,
      previous: cursor.beforeCursor,
      hasNext: cursor.afterCursor != null,
      hasPrev: cursor.beforeCursor != null,
    };
    return response;
  }

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
