import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Order from '../order/order.entity';
import { ShippingFeeDto } from './dto/get-fee.dto';
import ApiResponse from 'src/shared/res/apiReponse';

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

    async getProvinceName(provinceCode: number): Promise<any | undefined> {
        try {
            const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN')
                }
            })
            const data = response.data.data;
            const result = data.filter((item) => item.ProvinceID == provinceCode).map((item) => ({
                ProvinceName: item.ProvinceName
            }))
            return result[0].ProvinceName;
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

    async getDistrictName(districtCode: number, provinceID: number): Promise<any | undefined> {
        try {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN')
                }
            })
            const data = response.data.data;
            const result = data.filter((item) => item.DistrictID == districtCode).map((item) => ({
                DistrictName: item.DistrictName
            }))
            return result[0].DistrictName;
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

    async getWardName(wardCode: string, districtId: number): Promise<any | undefined> {
        try {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN')
                }
            })
            const data = response.data.data;
            const result = data.filter((item) => item.WardCode == wardCode)
            return result[0].WardName;
        } catch (err) {
            return err.response.data.message;
        }
    }

    async getShippingFee(data: ShippingFeeDto): Promise<any | undefined> {
        try {
            const bodyData = {
                "to_ward_code": data.wardCode,
                "to_district_id": data.districtId,
                "service_id": 53320,
                "weight": 500
            }

            const response = await axios.post(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
                bodyData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': this.configService.get<string>('GHN_TOKEN'),
                        'shop_id': this.configService.get<string>('GHN_SHOP_ID')
                    }
                })
            return response.data.data.total;
        } catch (err) {
            return err.response.data.message;
        }
    }

    async createOrder(order: Order, cod: boolean, shippingFee?: number): Promise<any | undefined> {

        const bodyMomoData = {
            "to_name": order.name,
            "to_phone": order.phone,
            "to_address": order.shippingAddress,
            "to_ward_code": order.shippingWardCode,
            "to_district_id": order.shippingDistrictCode,
            "weight": 1000,
            "client_order_code": order.id,
            "content": `Bộ kit thức ăn ${order.id}`,
            "service_type_id": 2,
            "payment_type_id": 1,
            "required_note": "KHONGCHOXEMHANG",
            "name": order.id,
            "quantity": 1
        }

        let bodyData = bodyMomoData;

        if (cod === true) {
            const bodyCodData = {
                "to_name": order.name,
                "to_phone": order.phone,
                "to_address": order.shippingAddress,
                "to_ward_code": order.shippingWardCode,
                "to_district_id": order.shippingDistrictCode,
                "weight": 1000,
                "client_order_code": order.id,
                "content": `Bộ kit thức ăn ${order.id}`,
                "service_type_id": 2,
                "payment_type_id": 2,
                "cod_amount": order.totalPrice - shippingFee,
                "required_note": "KHONGCHOXEMHANG",
                "name": order.id,
                "quantity": 1
            }
            bodyData = bodyCodData
        }

        let result = undefined;
        try {
            const response = await axios.post(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create`, bodyData, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN'),
                    'shop_id': this.configService.get<string>('GHN_SHOP_ID')
                },

            })
            result = response.data
        } catch (error) {
            console.log(error.response.data)
        }
        return result
    }

    async cancelOrder(orderCode: string): Promise<any | undefined> {
        try {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel?order_codes=${orderCode}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.configService.get<string>('GHN_TOKEN'),
                    'shop_id': this.configService.get<string>('GHN_SHOP_ID')
                },
            })
            return response.data.code;
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createFullAddress(provinceCode: number, districtCode: number, wardCode: string): Promise<any | undefined> {
        try {
            const provinceName = await this.getProvinceName(provinceCode);
            const districtName = await this.getDistrictName(districtCode, provinceCode);
            const wardName = await this.getWardName(wardCode, districtCode);
            const address = wardName + ', ' + districtName + ', ' + provinceName
            return address;
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
