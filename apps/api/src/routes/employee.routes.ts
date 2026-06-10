import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller';
import { validateRequest } from '../middleware/validateRequest';
import { CreateEmployeeSchema, UpdateEmployeeSchema, LoginEmployeeSchema } from '@attendance/shared-types';

const router = Router();

router.get('/', employeeController.getAll);
router.post('/login', validateRequest(LoginEmployeeSchema), employeeController.login);
router.get('/:id', employeeController.getById);
router.post('/', validateRequest(CreateEmployeeSchema), employeeController.create);
router.put('/:id', validateRequest(UpdateEmployeeSchema), employeeController.update);
router.delete('/:id', employeeController.delete);

export default router;
