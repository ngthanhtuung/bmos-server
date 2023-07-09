import { Body, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Order from '../order/order.entity';

@Injectable()
export class DeliveryService {

    constructor(
        private readonly configService: ConfigService
    ) { }

    async getProvince(): Promise<any | undefined> {
        try {
            const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN')
                }
            })
            const data = response.data.data;
            const result = data.filter((item) => item.ProvinceID !== 284).map((item) => ({
                ProvinceID: item.ProvinceID,
                ProvinceName: item.ProvinceName
            }))
            return result;
        } catch (err) {
            return err.response.data.message;
        }
    }

    async getDistrict(provinceID: number): Promise<any | undefined> {
        try {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN')
                }
            })
            const data = response.data.data;
            const result = data.filter((item) => (item.DistrictID !== 3713 && item.DistrictID !== 3715)).map((item) => ({
                DistrictID: item.DistrictID,
                DistrictName: item.DistrictName
            }))
            return result;
        } catch (err) {
            return err.response.data.message;
        }
    }

    async getWard(districtId: number): Promise<any | undefined> {
        try {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN')
                }
            })
            const data = response.data.data;
            const result = data.map((item) => ({
                WardCode: item.WardCode,
                WardName: item.WardName
            }))
            return result;
        } catch (err) {
            return err.response.data.message;
        }
    }

    async createOrder(order: Order): Promise<any | undefined> {
        console.log("Order:", order);

        const response = await axios.post(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create`, {
            headers: {
                'Content-Type': 'application/json',
                'token': this.configService.get<string>('GHN_TOKEN'),
                'shop_id': this.configService.get<string>('GHN_SHOP_ID')
            },
            Body: {
                "to_name": order.name,
                "to_phone": order.phone,
                "to_address": order.shippingAddress,
                "to_ward_code": order.shippingWardCode,
                "to_district_id": order.shippingDistrictCode,
                "content": order.id,
                "name": order.id
            }
        })
        console.log("response:", response);
        return response
    }
}
