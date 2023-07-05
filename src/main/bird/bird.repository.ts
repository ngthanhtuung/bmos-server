import { Repository } from "typeorm";
import Bird from "./bird.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { BirdCreateDto } from "./dto/bird-create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import ApiResponse from "src/shared/res/apiReponse";

@CustomRepository(Bird)
export class BirdRepository extends Repository<Bird> {



    async newBird(data: BirdCreateDto): Promise<any | undefined> {
        try {
            const bird = new Bird();
            bird.birdName = data.birdName;
            bird.birdColor = data.birdColor;
            bird.images = data.images;
            const result = await this.save(bird);
            if (result) {
                return new ApiResponse('Success', 'Create bird successfully', result);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}