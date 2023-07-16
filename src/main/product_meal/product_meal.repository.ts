import { Repository } from "typeorm";
import ProductMeal from "./product_meal.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { v4 as uuidv4 } from 'uuid';

@CustomRepository(ProductMeal)
export default class ProductMealRepository extends Repository<ProductMeal> {

    async insertProductMeal(mealId: string, data: any[]): Promise<any | undefined> {
        console.log("Data:", data);

        try {
            let query = 'INSERT INTO product_meal (id, mealId, productId, amount, section) VALUES ';
            for (let i = 0; i < data.length; i++) {
                const product = data[i];
                const id = uuidv4();
                query += `('${id}', '${mealId}', '${product.id}', ${product.amount}, '[`;
                for (let index = 0; index < product.section.length; index++) {
                    const section = product.section[index];
                    query += `"${section}"`
                    if (index !== product.section.length - 1) {
                        query += ',';
                    }else{
                        query += `]')`;
                    }
                }
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
    async deleteProductMeal(mealId: string): Promise<any | undefined> {
        try {
            // const result = await this.delete(mealId)
            const deleted = await this.createQueryBuilder('product_meal')
                .delete()
                .where('mealId = :id', { id: mealId })
                .execute();
            if (deleted) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }
}