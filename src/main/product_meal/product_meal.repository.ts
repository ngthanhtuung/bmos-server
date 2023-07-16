import { Repository } from "typeorm";
import ProductMeal from "./product_meal.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { v4 as uuidv4 } from 'uuid';

@CustomRepository(ProductMeal)
export default class ProductMealRepository extends Repository<ProductMeal> {
    handleDataProduct(data: any[]) {
        const products = [];
        data.forEach(section => {
            for (const key in section) {
                const sectionName = key;
                console.log("sectionName:", sectionName);
                const items = section[key];
                console.log("Items:", items);
                items.forEach(item => {
                    const productId = item.id;
                    const productAmount = item.amount;
                    const existingProduct = products.find(product => product.id === productId);
                    if (existingProduct) {
                        existingProduct.section.push(sectionName);
                    } else {
                        const newProduct = {
                            id: productId,
                            amount: productAmount,
                            section: [sectionName]
                        };
                        products.push(newProduct);
                    }
                });
            }
        });
        return products
    }
    async insertProductMeal(mealId: string, data: any[]): Promise<any | undefined> {
        console.log("Data:", data);
        try {
            let query = 'INSERT INTO product_meal (id, mealId, productId, amount, section) VALUES ';
            const products = this.handleDataProduct(data)
            console.log("ProductList:", products);
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const id = uuidv4();
                query += `('${id}', '${mealId}', '${product.id}', ${product.amount}, '[`;
                if (product.section.length === 0) {
                    query += `]')`;
                } else {
                    for (let index = 0; index < product.section.length; index++) {
                        const section = product.section[index];
                        query += `"${section}"`
                        if (index !== product.section.length - 1) {
                            query += ',';
                        } else {
                            query += `]')`;
                        }
                    }
                }
                if (i !== products.length - 1) {
                    query += ', ';
                }
            }
            const result = await this.query(query);
            if (products.length === result.affectedRows) {
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