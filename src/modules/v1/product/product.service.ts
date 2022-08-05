import { IProduct } from '../../../types';
import { Product } from '../../../database';
import { catchError } from '../../common/utils';

class ProductService implements IProduct {
    id: string;

    url: string;

    name: string;

    description: string;

    constructor(id = '', name = '') {
        this.id = id;
        this.name = name;
    }

    // eslint-disable-next-line class-methods-use-this
    public async createProduct(params: IProduct) {
        try {
            const newProduct = new Product(params);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw catchError('There was a problem adding this product', 500);
        }
    }

    public async findOne() {
        const product = await Product
            .findOne()
            .where(this.id ? '_id' : 'name')
            .equals(this.id ? this.id : this.name)
            .catch((_e) => {
                throw catchError('There was a problem finding this product', 500);
            });
        return product;
    }

    // eslint-disable-next-line class-methods-use-this
    public async findAll() {
        const products = await Product
            .find()
            .catch((_e) => {
                throw catchError('There was a problem finding all products', 500);
            });
        return products;
    }

    public async update(params: Partial<IProduct>) {
        const updatedProduct = await Product
            .findOneAndUpdate(
                { _id: this.id },
                { $set: params },
                { new: true },
            )
            .catch((_e) => {
                throw catchError('There was a problem updating this product', 500);
            });
        return updatedProduct;
    }

    public async delete() {
        const deletedProduct = await Product
            .deleteOne(
                { _id: this.id },
            )
            .catch((_e) => {
                throw catchError('There was a problem deleting this product', 500);
            });
        return deletedProduct;
    }
}

export default ProductService;
