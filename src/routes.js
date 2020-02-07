import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';
import RecipientsController from './app/controllers/RecipientsController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.post('/deliverymen', DeliverymanController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
