import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
@ApiTags('Delivery')
export class DeliveryController {

    constructor(
        private readonly deliveryService: DeliveryService
    ) { }

    @Get('/province')
    async getProvince(): Promise<any | undefined> {
        return await this.deliveryService.getProvince();
    }

    @Get('/district')
    async getDistrict(@Query('province_id') province_id: number): Promise<any | undefined> {
        return await this.deliveryService.getDistrict(province_id);
    }

    @Get('/ward')
    async getWard(@Query('district_id') district_id: number): Promise<any | undefined> {
        return await this.deliveryService.getWard(district_id);
    }
}
