import { Router, Request, Response } from 'express';
import { readJson, writeJson } from '../utils/jsonStore';

interface Appointment {
  appointment_id: string;
  customer_id: string;
  vin: string;
  dealership_id: string;
  service_codes_requested: string[];
  requested_datetime: string;
  inventory_needed: string[];
  status: string;
  estimated_delay_minutes: number;
  pickup_drop_required?: boolean;
  pickup_address?: string;
  user_issue_summary?: string;
}

interface InventoryItem {
  part_name: string;
  quantity: number;
}

interface Dealership {
  dealership_id: string;
  inventory: InventoryItem[];
}

const router = Router();
const APPOINTMENTS_FILE = 'appointments.json';
const DEALERSHIPS_FILE = 'dealerships.json';

async function loadAppointments(): Promise<Appointment[]> {
  return readJson<Appointment[]>(APPOINTMENTS_FILE, []);
}

async function saveAppointments(list: Appointment[]): Promise<void> {
  await writeJson(APPOINTMENTS_FILE, list);
}

async function loadDealerships(): Promise<Dealership[]> {
  return readJson<Dealership[]>(DEALERSHIPS_FILE, []);
}


/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

// Add similar documentation for other endpoints in each route file
router.post('/book', async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      vin,
      dealership_id,
      service_codes_requested,
      requested_datetime,
      inventory_needed,
      inventory_ok,
      estimated_delay_minutes,
      pickup_drop_required,
      pickup_address,
      user_issue_summary
    } = req.body as {
      customer_id: string;
      vin: string;
      dealership_id: string;
      service_codes_requested: string[];
      requested_datetime: string;
      inventory_needed: string[];
      inventory_ok: boolean;
      estimated_delay_minutes?: number;
      pickup_drop_required?: boolean;
      pickup_address?: string;
      user_issue_summary?: string;
    };

    if (!customer_id || !vin || !dealership_id || !requested_datetime || !Array.isArray(service_codes_requested)) {
      return res.status(400).json({ message: 'Missing required fields for booking' });
    }

    const [appointments, dealerships] = await Promise.all([loadAppointments(), loadDealerships()]);

    const newId = `APT_${String(appointments.length + 1).padStart(3, '0')}`;

    let status = 'confirmed';
    let delay = estimated_delay_minutes ?? 0;

    if (!inventory_ok) {
      status = 'awaiting_inventory_confirmation';
    } else {
      // decrement inventory when inventory_ok is true
      const dlr = dealerships.find((d) => d.dealership_id === dealership_id);
      if (dlr && Array.isArray(inventory_needed)) {
        for (const label of inventory_needed) {
          const item = dlr.inventory.find((i) => i.part_name === label);
          if (item && item.quantity > 0) {
            item.quantity -= 1;
          }
        }
        await writeJson(DEALERSHIPS_FILE, dealerships);
      }
    }

    const appointment: Appointment = {
      appointment_id: newId,
      customer_id,
      vin,
      dealership_id,
      service_codes_requested: service_codes_requested || [],
      requested_datetime,
      inventory_needed: inventory_needed || [],
      status,
      estimated_delay_minutes: delay,
      pickup_drop_required,
      pickup_address,
      user_issue_summary
    };

    appointments.push(appointment);
    await saveAppointments(appointments);

    return res.status(201).json({
      message: 'Appointment created',
      appointment
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to book appointment', error: (err as Error).message });
  }
});

router.get('/list', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query as { customer_id?: string };
    const appointments = await loadAppointments();
    const filtered = customer_id
      ? appointments.filter((a) => a.customer_id === customer_id)
      : appointments;
    return res.status(200).json({ appointments: filtered });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list appointments', error: (err as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointments = await loadAppointments();
    const appointment = appointments.find((a) => a.appointment_id === id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.status(200).json({ appointment });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get appointment', error: (err as Error).message });
  }
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, estimated_delay_minutes } = req.body as {
      status?: string;
      estimated_delay_minutes?: number;
    };

    const appointments = await loadAppointments();
    const idx = appointments.findIndex((a) => a.appointment_id === id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status) {
      appointments[idx].status = status;
    }
    if (typeof estimated_delay_minutes === 'number') {
      appointments[idx].estimated_delay_minutes = estimated_delay_minutes;
    }

    await saveAppointments(appointments);

    return res.status(200).json({ message: 'Appointment updated', appointment: appointments[idx] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update appointment', error: (err as Error).message });
  }
});

export default router;
