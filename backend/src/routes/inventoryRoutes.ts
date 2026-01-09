import { Router, Request, Response } from 'express';
import { readJson } from '../utils/jsonStore';

interface InventoryItem {
  part_name: string;
  quantity: number;
}

interface Dealership {
  dealership_id: string;
  inventory: InventoryItem[];
}

const router = Router();
const DEALERSHIPS_FILE = 'dealerships.json';

async function loadDealerships(): Promise<Dealership[]> {
  return readJson<Dealership[]>(DEALERSHIPS_FILE, []);
}


/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Vehicle inventory management
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all vehicles in inventory
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: make
 *         schema: { type: string }
 *       - in: query
 *         name: model
 *         schema: { type: string }
 *       - in: query
 *         name: year
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
router.post('/check', async (req: Request, res: Response) => {
  try {
    const { dealership_id, inventory_needed } = req.body as {
      dealership_id: string;
      inventory_needed: string[]; // list of part_name labels
    };

    if (!dealership_id || !Array.isArray(inventory_needed)) {
      return res.status(400).json({ message: 'dealership_id and inventory_needed are required' });
    }

    const dealerships = await loadDealerships();
    const dealership = dealerships.find((d) => d.dealership_id === dealership_id);
    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    const missing_parts: string[] = [];
    for (const label of inventory_needed) {
      const item = dealership.inventory.find((i) => i.part_name === label);
      if (!item || item.quantity <= 0) {
        missing_parts.push(label);
      }
    }

    if (missing_parts.length > 0) {
      const estimated_delay_days = Math.min(14, missing_parts.length * 3) || 3;
      return res.status(200).json({
        inventory_ok: false,
        missing_parts,
        estimated_delay_days,
        message: 'Some required parts are currently unavailable. Are you okay with a delay?'
      });
    }

    return res.status(200).json({ inventory_ok: true });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to check inventory', error: (err as Error).message });
  }
});

export default router;
