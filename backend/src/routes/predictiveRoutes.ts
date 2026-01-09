import { Router, Request, Response } from 'express';
import { readJson } from '../utils/jsonStore';
import { runPredictiveModel } from '../../predictive_model/adapter';

interface ServiceHistoryRecord {
  record_id: string;
  customer_id: string;
  vin: string;
  date: string;
  service_codes_performed: string[];
  mileage_km: number;
  issues_reported: string[];
}

interface CustomerVehicle {
  vin: string;
  model: string;
  year: number;
}

interface Customer {
  customer_id: string;
  vehicles: CustomerVehicle[];
}

const router = Router();
const HISTORY_FILE = 'service_history.json';
const CUSTOMERS_FILE = 'customers.json';



router.post('/', async (req: Request, res: Response) => {
  try {
    const { customer_id, vin } = req.body as { customer_id: string; vin: string };
    if (!customer_id || !vin) {
      return res.status(400).json({ message: 'customer_id and vin are required' });
    }

    const [history, customers] = await Promise.all([
      readJson<ServiceHistoryRecord[]>(HISTORY_FILE, []),
      readJson<Customer[]>(CUSTOMERS_FILE, [])
    ]);

    const relevantHistory = history.filter((h) => h.customer_id === customer_id && h.vin === vin);

    const customer = customers.find((c) => c.customer_id === customer_id);
    const vehicle = customer?.vehicles.find((v) => v.vin === vin);

    const latestMileage = relevantHistory.length
      ? relevantHistory[relevantHistory.length - 1].mileage_km
      : undefined;

    const payload = {
      customer_id,
      vin,
      history: relevantHistory,
      vehicle_features: {
        mileage_km: latestMileage,
        model: vehicle?.model,
        year: vehicle?.year
      }
    };

    const result = await runPredictiveModel(payload);

    return res.status(200).json({
      customer_id,
      vin,
      recommendations: result.recommendations
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to run predictive maintenance', error: (err as Error).message });
  }
});

export default router;
