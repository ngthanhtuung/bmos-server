import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealCreateDto } from './dto/meal-create.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import Account from '../account/account.entity';
import { RolesGuard } from '../auth/role/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { MealUpdateDto } from './dto/meal-update.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('meal')
@ApiTags('Meal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealController {

    constructor(
        private readonly mealService: MealService,
    ) { }

    @Get('/title')
    @ApiQuery({
        name: 'title',
        required: false
    })
    @ApiQuery({
        name: 'idBird',
        required: false
    })
    async getAllMealByTitle(@Query('title') title: string, @Query('idBird') idBird: string) {
        return await this.mealService.getAllMealByTitle(title, idBird);
    }

    @Get('/')
    async getAllMeal(@GetUser() user: Account) {
        return await this.mealService.getAllMeal(user);
    }

    @Get('/customer')
    async getAllMealByCustomer(@GetUser() user: Account) {
        return await this.mealService.getAllMealByCustomer(user.id);
    }
    @Post('/create')
    async createMealByCustomer(@GetUser() user: Account, @Body() data: MealCreateDto) {
        return await this.mealService.createMeal(data, user);
    }

    @Put('/update')
    async updateMealByCustomer(@GetUser() user: Account, @Body() data: MealUpdateDto) {
        return await this.mealService.updateMeal(data, user);
    }

    @Get('detail/:mealId')
    async getMealDetail(@Param('mealId') mealId: string) {
        return await this.mealService.getMealDetail(mealId);
    }

    @Get('bird/:birdId')
    async getMealByBird(@Param('birdId') birdId: string) {
        return await this.mealService.getMealByBird(birdId);
    }

    @Put('status/:mealId')
    async deleteMeal(@Param('mealId') meaId: string, @GetUser() user: Account): Promise<any | undefined> {
        return await this.mealService.updateMealStatus(meaId, user);
    }

}
