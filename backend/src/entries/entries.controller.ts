import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { Public } from 'src/auth/const/const';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { DictionaryUpdateDto } from 'src/dictionary/dto/dictionary-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { FavoriteWordDto } from 'src/user/dto/favorite-word.dto';

@Controller('entries/en')
export class EntriesController {
  private readonly logger = new Logger(EntriesController.name);

  constructor(
    private readonly entriesService: EntriesService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  @Public()
  @Get('')
  async searchEntries(
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('prev') prev: string,
    @Query('after') after: string,
    @Query('page') page: number,
  ): Promise<Object> {
    this.logger.debug(
      search + ' ' + limit + ' ' + prev + ' ' + after + ' ' + page,
    );
    return this.entriesService.search(search, limit, prev, after, page);
  }
  @UseGuards(AuthGuard)
  @Get(':word')
  async getEntryWithHistory(
    @Param('word') word: string,
    @Request() req,
  ): Promise<Dictionary> {
    this.logger.debug('/:word/ with Authorization. Saving history ' + +word);
    let cache = this.getEntry(word);
    this.userService.saveHistory(req.user.id, word);
    return cache;
  }
  @Public()
  @Get(':word')
  async getEntry(@Param('word') word: string): Promise<Dictionary> {
    this.logger.log('Recuperando ' + word);
    const cache = await this.entriesService.getEntry(word).catch((e) => {
      throw new HttpException('Palavra não encontrada', HttpStatus.NOT_FOUND);
    });

    if (!cache.wordMetadata) {
      this.logger.log('Metadata não encontrado. Requisitando da API');
      const metadata = await firstValueFrom(
        this.httpService.get(process.env.DICTIONARY_API + word),
      );
      const newDictionary = new DictionaryUpdateDto();
      newDictionary.wordMetadata = metadata.data;
      newDictionary.word = word;
      this.logger.log('Updating ' + word);
      return this.entriesService.updateEntry(word, newDictionary);
    }
    this.logger.log('Cache hit');
    return new Promise((resolve) => resolve(cache));
  }

  @UseGuards(AuthGuard)
  @Post(':word/favorite')
  async favoriteWord(@Param('word') word: string, @Request() req) {
    let favoriteDto = new FavoriteWordDto();
    favoriteDto.word = word;
    favoriteDto.userId = req.user.id;
    if (await this.userService.favoriteWord(favoriteDto)) {
      return HttpStatus.OK;
    }
    return HttpStatus.NOT_FOUND;
  }
  @UseGuards(AuthGuard)
  @Delete(':word/unfavorite')
  async unfavoriteWord(@Param('word') word: string, @Request() req) {
    let favoriteDto = new FavoriteWordDto();
    favoriteDto.word = word;
    favoriteDto.userId = req.user.id;
    if (await this.userService.unfavoriteWord(favoriteDto)) {
      return HttpStatus.OK;
    }
    return HttpStatus.NOT_FOUND;
  }
}
