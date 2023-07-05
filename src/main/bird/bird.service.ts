import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BirdCreateDto } from './dto/bird-create.dto';
import { BirdRepository } from './bird.repository';
import ApiResponse from 'src/shared/res/apiReponse';


@Injectable()
export class BirdService {

    constructor(
        private readonly birdRepository: BirdRepository
    ) { }


    async getAllBird(): Promise<any | undefined> {
        try {
            const result = await this.birdRepository.find({
                where: { status: true }
            });
            if (result) {
                return new ApiResponse('Success', 'Get all bird successfully', result);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBirdById(birdId: string): Promise<any | undefined> {
        try {
            const bird = await this.birdRepository.findOne({
                where: { id: birdId }
            })
            return bird;
        } catch (err) {
            return null;
        }
    }

    async createBird(data: BirdCreateDto): Promise<any | undefined> {
        return await this.birdRepository.newBird(data);
    }
}
