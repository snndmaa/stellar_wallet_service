import { body, param } from 'express-validator';

const validateProduct = {
    addProduct: [
        body('name').isString().notEmpty(),
        body('url').isString().notEmpty().isURL(),
        body('description').isString().notEmpty(),
    ],
    validateId: [
        param('id').isString().notEmpty(),
    ],
};

export default validateProduct;
