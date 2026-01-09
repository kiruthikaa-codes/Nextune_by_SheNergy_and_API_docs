// import { Router } from 'express';
// import authRouter from './authRoutes';
// import servicesRouter from './servicesRoutes';
// import dealershipsRouter from './dealershipsRoutes';
// import inventoryRouter from './inventoryRoutes';
// import predictiveRouter from './predictiveRoutes';
// import appointmentsRouter from './appointmentsRoutes';
// import chatRouter from './chatRoutes';

// const router = Router();

// router.use('/auth', authRouter);
// router.use('/services', servicesRouter);
// router.use('/dealerships', dealershipsRouter);
// router.use('/inventory', inventoryRouter);
// router.use('/predict-maintenance', predictiveRouter);
// router.use('/appointments', appointmentsRouter);
// router.use('/chat', chatRouter);

// export default router;

// routes/index.ts
import { Router } from 'express';
import authRouter from './authRoutes';
import servicesRouter from './servicesRoutes';
import dealershipsRouter from './dealershipsRoutes';
import inventoryRouter from './inventoryRoutes';
import predictiveRouter from './predictiveRoutes';
import appointmentsRouter from './appointmentsRoutes';
import chatRouter from './chatRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/services', servicesRouter);
router.use('/dealerships', dealershipsRouter);
router.use('/inventory', inventoryRouter);
router.use('/predict-maintenance', predictiveRouter);
router.use('/appointments', appointmentsRouter);
router.use('/chat', chatRouter);

export default router;