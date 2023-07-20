import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BirdCreateDto } from './dto/bird-create.dto';
import { BirdRepository } from './bird.repository';
import ApiResponse from 'src/shared/res/apiReponse';
import { BirdUpdateDto } from './dto/bird-update.dto';
import Account from '../account/account.entity';
import { RoleEnum } from '../role/role.enum';


@Injectable()
export class BirdService {

    constructor(
        private readonly birdRepository: BirdRepository
    ) { }


    async getAllBird(user: Account): Promise<any | undefined> {
        const roleName = user.role.name;
        try {
            let result;
            if (roleName === RoleEnum.CUSTOMER) {
                result = await this.birdRepository.find({
                    where: { status: true }
                });
            } else {
                result = await this.birdRepository.find({});
            }
            if (result) {
                return new ApiResponse('Success', 'Get all bird successfully', result);
            }
            throw new HttpException(new ApiResponse('Fail', 'Bird list not found'), HttpStatus.NOT_FOUND)
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
    async getBirdDetail(birdId: string): Promise<any | undefined> {
        try {
            const bird = await this.birdRepository.findOne({
                where: { id: birdId }
            })
            return new ApiResponse('Success', `Get bird detail successfully`, bird);
        } catch (err) {
            return null;
        }
    }
    async createBird(data: BirdCreateDto): Promise<any | undefined> {
        return await this.birdRepository.newBird(data);
    }

    async updateBird(birdId: string, data: BirdUpdateDto): Promise<any | undefined> {
        try {
            const bird = await this.getBirdById(birdId);
            if (bird) {
                bird.birdName = data.birdName,
                    bird.birdColor = data.birdColor,
                    bird.images = data.images,
                    bird.status = data.status
                const updateBird = await this.birdRepository.save(bird);
                return new ApiResponse('Success', 'Update bird successfully', updateBird)
            }
            throw new HttpException(new ApiResponse('Fail', 'Bird not found'), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateBirdStatus(birdId: string, status: any): Promise<any | undefined> {
        const newStatus = status === 'true' ? 1 : 0
        try {
            const bird = await this.getBirdById(birdId);
            if (bird) {
                bird.status = newStatus;
                await this.birdRepository.save(bird);
                let message = (status === 'true') ? 'Active' : 'Inactive';
                return new ApiResponse('Success', `${message} bird successfully`, bird);
            }
            throw new HttpException(new ApiResponse('Fail', 'Bird not found'), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
