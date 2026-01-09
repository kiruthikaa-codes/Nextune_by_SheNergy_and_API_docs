import { Router, Request, Response } from 'express';
import { readJson } from '../utils/jsonStore';

interface ServiceMasterItem {
  service_code: string;
  name: string;
  description: string;
  average_time_minutes: number;
  categories: string[];
}

const router = Router();
const SERVICES_FILE = 'services_master.json';


/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Vehicle services and maintenance
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all available services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */

/**
 * @swagger
 * /services/schedule:
 *   post:
 *     summary: Schedule a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *     responses:
 *       201:
 *         description: Service scheduled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.get('/list', async (_req: Request, res: Response) => {
  try {
    const services = await readJson<ServiceMasterItem[]>(SERVICES_FILE, []);
    return res.status(200).json({ services });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load services', error: (err as Error).message });
  }
});

export default router;
