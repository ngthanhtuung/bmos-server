import { NewsRepository } from './news.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ApiResponse from 'src/shared/res/apiReponse';
import { NewsCreateDto } from './dto/news-dto-create';
import { NewsUpdateDTO } from './dto/news-dto-update';


@Injectable()
export class NewsService {

    constructor(
        private readonly newsRepository: NewsRepository,
    ) { }


    async getAllNews(): Promise<any | undefined> {
        try {
            const newsAll = await this.newsRepository.getAllNews();
            if (newsAll) {
                return newsAll;
            }
            throw new HttpException(new ApiResponse('Fail', `Don't have any order`), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async getNewsDetail(idNews: string): Promise<any | undefined> {
        try {
            const news = await this.newsRepository.getNewsDetail(idNews);
            if (news) {
                return news;
            }
            throw new HttpException(new ApiResponse('Fail', `Don't have any news`), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async createNews(data: NewsCreateDto): Promise<any | undefined> {
        return await this.newsRepository.createNews(data);
    }
    async updateStatus(idNews: string, status: boolean): Promise<any | undefined> {
        return await this.newsRepository.updateStatusNews(idNews, status);
    }
    async updateNews(idNews: string, data: NewsUpdateDTO): Promise<any | undefined> {
        return await this.newsRepository.updateNews(idNews, data);
    }
}
