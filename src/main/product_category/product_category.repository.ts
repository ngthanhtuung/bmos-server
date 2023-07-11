import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import Category from "./category.entity";
import { Repository } from "typeorm";


@CustomRepository(Category)
export class ProductCategoryRepository extends Repository<Category>{

}