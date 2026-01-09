import { spawn } from 'child_process';
import path from 'path';

interface PredictRequest {
  customer_id: string;
  vin: string;
  history: any[];
  vehicle_features: Record<string, any>;
}

interface Recommendation {
  service_code: string;
  priority: number;
  reason: string;
}

interface PredictResponse {
  recommendations: Recommendation[];
}

export async function runPredictiveModel(payload: PredictRequest): Promise<PredictResponse> {
  const pythonPath = process.env.PYTHON_PATH || 'python';
  const timeoutMs = Number(process.env.MODEL_TIMEOUT_MS || 20000);
  const scriptPath = path.join(__dirname, 'model.py');

  return new Promise((resolve, reject) => {
    const proc = spawn(pythonPath, [scriptPath]);

    let stdout = '';
    let stderr = '';
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        proc.kill('SIGKILL');
        reject(new Error('Predictive model timed out'));
      }
    }, timeoutMs);

    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(err);
    });

    proc.on('close', () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(stdout || '{}');
        if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
          throw new Error('Invalid model output structure');
        }
        resolve({ recommendations: parsed.recommendations });
      } catch (err) {
        reject(new Error(`Failed to parse model output: ${stderr || (err as Error).message}`));
      }
    });

    // send payload
    proc.stdin.write(JSON.stringify(payload));
    proc.stdin.end();
  });
}
