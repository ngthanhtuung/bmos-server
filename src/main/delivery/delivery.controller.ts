import { Body, Controller, Get, Query, UnauthorizedException, Post, Delete, Param } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { ShippingFeeDto } from './dto/get-fee.dto';

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

    @Post('/fee')
    @ApiBody({
        type: ShippingFeeDto

    })
    async getFee(@Body() data: ShippingFeeDto): Promise<any | undefined> {
        return await this.deliveryService.getShippingFee(data);
    }

}
