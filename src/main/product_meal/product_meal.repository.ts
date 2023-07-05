import { Repository } from "typeorm";
import ProductMeal from "./product_meal.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { ProductInMealDto } from "../meal/dto/meal-create.dto";
import { v4 as uuidv4 } from 'uuid';

@CustomRepository(ProductMeal)
export default class ProductMealRepository extends Repository<ProductMeal> {

    async insertProductMeal(mealId: string, data: any[]): Promise<any | undefined> {
        try {
            let query = 'INSERT INTO product_meal (id, mealId, productId, amount) VALUES ';
            for (let i = 0; i < data.length; i++) {
                const product = data[i];
                const id = uuidv4();
                query += `('${id}', '${mealId}', '${product.id}', ${product.amount})`;
                if (i !== data.length - 1) {
                    query += ', ';
                }
            }
            const result = await this.query(query);
            if (data.length === result.affectedRows) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }
}