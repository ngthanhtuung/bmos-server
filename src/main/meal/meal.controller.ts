import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealCreateDto } from './dto/meal-create.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import Account from '../account/account.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { MealCheckDto } from './dto/meal-check.dto';

@Controller('meal')
@ApiTags('Meal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MealController {

    constructor(
        private readonly mealService: MealService,
    ) { }

    @Get('/')
    async getAllMeal() {
        return await this.mealService.getAllMeal();
    }

    @Get('/:birdId')
    async getMealByBird(@Param('birdId') birdId: string) {
        return await this.mealService.getMealByBird(birdId);
    }

    @Post('/create')
    async createMealByCustomer(@GetUser() user: Account, @Body() data: MealCreateDto) {
        return await this.mealService.createMeal(data, user);
    }

}
