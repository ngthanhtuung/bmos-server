import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

}
