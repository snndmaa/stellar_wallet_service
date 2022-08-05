import {
    Request,
    Response,
    NextFunction,
} from 'express';
import { success } from '../../common/utils';
import ProductService from './product.service';

export const addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { name, url, description } = req.body;
    try {
        const product = await new ProductService().createProduct({ name, url, description });
        return res.status(200).json(
            success('Product successfully created', product),
        );
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    console.log(id, 'got here');
    try {
        const product = await new ProductService(id).findOne();
        return res.status(200).json(
            success('Product successfully found', product),
        );
    } catch (error) {
        next(error);
    }
};

export const findAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await new ProductService().findAll();
        return res.status(200).json(
            success('Products successfully found', products),
        );
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const {
        body: { name, url, description },
        params: { id },
    } = req;
    try {
        const product = await new ProductService(id).update({
            ...(url && { url }),
            ...(name && { name }),
            ...(description && { description }),
        });
        return res.status(200).json(
            success('Product successfully updated', product),
        );
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const {
        params: { id },
    } = req;
    try {
        const product = await new ProductService(id).delete();
        return res.status(200).json(
            success('Product successfully deleted', product),
        );
    } catch (error) {
        next(error);
    }
};
