import { Router, Request, Response } from 'express';
import path from 'path';
import { readJson, writeJson } from '../utils/jsonStore';

interface Vehicle {
  vin: string;
  model: string;
  year: number;
}

interface Customer {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  vehicles: Vehicle[];
}

const router = Router();
const CUSTOMERS_FILE = 'customers.json';

async function loadCustomers(): Promise<Customer[]> {
  return readJson<Customer[]>(CUSTOMERS_FILE, []);
}

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new customer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 customer:
 *                   type: object
 *                   properties:
 *                     customer_id: { type: 'string' }
 *                     name: { type: 'string' }
 *                     email: { type: 'string', format: 'email' }
 *                     phone: { type: 'string' }
 *                     username: { type: 'string' }
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string' }
 *                 error: { type: 'string' }
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, username, password } = req.body;
    if (!username || !password || !email || !name || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const customers = await loadCustomers();
    if (customers.find((c) => c.username === username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newCustomer: Customer = {
      customer_id: `CUST_BLR_${String(customers.length + 1).padStart(3, '0')}`,
      name,
      email,
      phone,
      username,
      password, // plaintext for prototype
      vehicles: []
    };

    customers.push(newCustomer);
    await writeJson(CUSTOMERS_FILE, customers);

    return res.status(201).json({
      message: 'Signup successful',
      customer: {
        customer_id: newCustomer.customer_id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        username: newCustomer.username
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to signup', error: (err as Error).message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a customer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 customer:
 *                   type: object
 *                   properties:
 *                     customer_id: { type: 'string' }
 *                     name: { type: 'string' }
 *                     email: { type: 'string', format: 'email' }
 *                     phone: { type: 'string' }
 *                     username: { type: 'string' }
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Failed to login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: 'string' }
 *                 error: { type: 'string' }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const customers = await loadCustomers();
    const customer = customers.find((c) => c.username === username && c.password === password);
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      message: 'Login successful',
      customer: {
        customer_id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        username: customer.username,
        vehicles: customer.vehicles
      },
      // simple prototype token
      token: `demo-token-${customer.customer_id}`
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login', error: (err as Error).message });
  }
});

export default router;
