import { Router, Request, Response } from 'express';
import { readJson } from '../utils/jsonStore';

interface InventoryItem {
  part_name: string;
  quantity: number;
}

interface Dealership {
  dealership_id: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  inventory: InventoryItem[];
  service_codes_supported: string[];
  rating: number;
  historical_satisfaction_score: number;
}

interface Appointment {
  appointment_id: string;
  dealership_id: string;
  estimated_delay_minutes: number;
  status: string;
}

const router = Router();
const DEALERSHIPS_FILE = 'dealerships.json';
const APPOINTMENTS_FILE = 'appointments.json';

async function loadDealerships(): Promise<Dealership[]> {
  return readJson<Dealership[]>(DEALERSHIPS_FILE, []);
}

async function loadAppointments(): Promise<Appointment[]> {
  return readJson<Appointment[]>(APPOINTMENTS_FILE, []);
}


router.get('/', async (_req: Request, res: Response) => {
  try {
    const dealerships = await loadDealerships();
    return res.status(200).json({ dealerships });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load dealerships', error: (err as Error).message });
  }
});


/**
 * @swagger
 * tags:
 *   name: Dealerships
 *   description: Dealership management
 */

/**
 * @swagger
 * /dealerships:
 *   get:
 *     summary: Get all dealerships
 *     tags: [Dealerships]
 *     responses:
 *       200:
 *         description: List of all dealerships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dealership'
 */

/**
 * @swagger
 * /dealerships/{id}:
 *   get:
 *     summary: Get dealership by ID
 *     tags: [Dealerships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dealership details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dealership'
 *       404:
 *         description: Dealership not found
 */
router.post('/rank', async (req: Request, res: Response) => {
  try {
    const { customer_id, vin, service_codes_requested, coordinates } = req.body as {
      customer_id: string;
      vin: string;
      service_codes_requested: string[];
      coordinates?: { lat: number; lng: number };
    };

    if (!customer_id || !vin || !Array.isArray(service_codes_requested)) {
      return res.status(400).json({ message: 'customer_id, vin and service_codes_requested are required' });
    }

    const [dealerships, appointments] = await Promise.all([
      loadDealerships(),
      loadAppointments()
    ]);

    const results = dealerships.map((d) => {
      // specialization: fraction of requested codes this dealership supports
      const supportedCount = service_codes_requested.filter((code) => d.service_codes_supported.includes(code)).length;
      const specializationScore = service_codes_requested.length
        ? supportedCount / service_codes_requested.length
        : 0;

      // predicted wait: average delay for this dealership
      const dlrAppointments = appointments.filter((a) => a.dealership_id === d.dealership_id);
      const avgDelay = dlrAppointments.length
        ? dlrAppointments.reduce((sum, a) => sum + (a.estimated_delay_minutes || 0), 0) / dlrAppointments.length
        : 0;
      const waitScore = avgDelay > 0 ? 1 / (1 + avgDelay / 60) : 1; // higher is better

      // simple composite score
      const ratingNorm = d.rating / 5;
      const satisfactionNorm = d.historical_satisfaction_score / 5;

      const score =
        0.35 * ratingNorm +
        0.25 * specializationScore +
        0.15 * waitScore +
        0.25 * satisfactionNorm;

      const reasonParts: string[] = [];
      reasonParts.push(`Rating ${d.rating.toFixed(1)} / 5`);
      reasonParts.push(`Specialization match ${(specializationScore * 100).toFixed(0)}%`);
      reasonParts.push(`Historical satisfaction ${d.historical_satisfaction_score.toFixed(1)} / 5`);
      if (avgDelay > 0) {
        reasonParts.push(`Typical delay around ${Math.round(avgDelay)} minutes`);
      } else {
        reasonParts.push('Low current load based on appointments data');
      }
      if (coordinates && d.coordinates) {
        reasonParts.push('Distance factor considered conceptually (not computed due to synthetic data)');
      }

      return {
        dealership_id: d.dealership_id,
        name: d.name,
        score,
        reason: reasonParts.join(' | ')
      };
    });

    // sort descending by score
    results.sort((a, b) => b.score - a.score);

    return res.status(200).json({ rankings: results });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to rank dealerships', error: (err as Error).message });
  }
});

export default router;
