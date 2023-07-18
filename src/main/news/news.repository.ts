import { Repository } from "typeorm";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { HttpException, HttpStatus } from "@nestjs/common";
import ApiResponse from "src/shared/res/apiReponse";
import News from "./news.entity";
import { NewsCreateDto } from "./dto/news-dto-create";
import * as moment from 'moment';
import 'moment-timezone';
import { NewsUpdateDTO } from "./dto/news-dto-update";
import { ContextUtils } from "@nestjs/core/helpers/context-utils";

@CustomRepository(News)
export class NewsRepository extends Repository<News> {

    async createNews(data: NewsCreateDto): Promise<any | undefined> {
        console.log("Test repo:", data);
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            const dataNews = {
                name: data.name,
                image: data.image,
                desc: data.desc,
                title: data.title,
                createDate: moment().format("YYYY-MM-DD HH:mm:ss")
            }
            const news = await this.save(dataNews)
            if (news) {
                await queryRunner.commitTransaction();
                return new ApiResponse('Success', 'Create news successfully', news);
            }
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }

    }

    async getAllNews(): Promise<any | undefined> {
        try {
            const News = await this.find()
            if (News) {
                return new ApiResponse('Success', 'Get all news successfully !!', News);
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatusNews(idNews: string, status: boolean): Promise<any | undefined> {
        try {
            const updatedStatus = await this.createQueryBuilder()
                .update(News)
                .set({
                    status: status === true ? true : false
                })
                .where('id = :idNews', { idNews: idNews })
                .execute();
            if (updatedStatus.affected > 0) {
                return new ApiResponse('Success', `${status === true ? 'Enable' : 'Disable'} news successfully`);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateNews(idNews: string, data: NewsUpdateDTO): Promise<any | undefined> {
        try {
            const updatedStatus = await this.createQueryBuilder()
                .update(News)
                .set({
                    title: data.title,
                    image: data.image,
                    status: data.status,
                })
                .where('id = :idNews', { idNews: idNews })
                .execute();
            if (updatedStatus.affected > 0) {
                return new ApiResponse('Success', `Update news successfully`);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getNewsDetail(idNews: string): Promise<any | undefined> {
        try {
            const query = `SELECT * FROM news WHERE news.id = '${idNews}'`
            const news = await this.query(query)
            if (news) {
                return new ApiResponse('Success', 'Get news detail successfully', news);
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountNews(): Promise<any | undefined> {
        try {
            const count = await this.createQueryBuilder('news').getCount();
            return count;
        } catch (err) {
            return null;
        }
    }
}
