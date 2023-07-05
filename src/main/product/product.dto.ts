import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";
import CategoryDto from "../product_category/category.dto";

export default class ProductDTO extends BaseDTO {

    @AutoMap()
    public productName: string;

    @AutoMap()
    public description: string;

    @AutoMap()
    public expiredDate: Date;

    @AutoMap()
    public price: number;

    @AutoMap()
    public image: string;

    @AutoMap()
    public remainQuantity: number;

    @AutoMap()
    public status: boolean;

    @AutoMap({ typeFn: () => CategoryDto })
    public category: CategoryDto;
}