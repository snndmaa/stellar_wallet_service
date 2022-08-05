import { Router } from 'express';
import { validate } from '../../common/utils';
import {
    addProduct,
    getProduct,
    findAll,
    deleteProduct,
    updateProduct,
} from './product.controller';
import validateProduct from './product.validation';

const ProductRoute = Router();

ProductRoute.route('/')
    .get(findAll)
    .post(validateProduct.addProduct, validate, addProduct);

ProductRoute.route('/:id')
    .get(validateProduct.validateId, validate, getProduct)
    .put(validateProduct.validateId, validate, updateProduct)
    .delete(validateProduct.validateId, validate, deleteProduct);

export default ProductRoute;
