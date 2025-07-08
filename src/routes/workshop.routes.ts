import { Router } from 'express';
import * as Controller from '../controllers/workshop.controller';
import { validate } from '../middleware/validate';
import { createWorkshopSchema, updateWorkshopSchema } from '../validators/workshop.schema';

const router = Router();

router.post('/', validate(createWorkshopSchema), Controller.createWorkshop);
router.get('/', Controller.getAllWorkshops);
router.put('/:id', validate(updateWorkshopSchema), Controller.updateWorkshop);
router.delete('/:id', Controller.deleteWorkshop);
router.get('/:id', Controller.getWorkshopById);

export default router;




