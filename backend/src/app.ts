// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { config } from 'dotenv';
// import { createServer, Server } from 'http';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { errorHandler } from './middleware/errorHandler';
// import apiRouter from './routes';

// // Load environment variables
// config();

// class App {
//   public app: Application;
//   public port: string | number;
//   public server: Server;

//   constructor() {
//     this.app = express();
//     this.port = process.env.PORT || 5000;
//     this.server = createServer(this.app);
//     this.initializeMiddlewares();
//     this.initializeRoutes();
//     this.initializeErrorHandling();
//   }

//   private initializeMiddlewares(): void {
//     // Security middleware
//     this.app.use(helmet({
//       contentSecurityPolicy: {
//         directives: {
//           ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//           'script-src': ["'self'", "'unsafe-inline'"],
//           'style-src': ["'self'", "'unsafe-inline'"],
//         },
//       },
//     }));
//     this.app.use(cors());
    
//     // Swagger setup
//     const swaggerOptions = {
//       definition: {
//         openapi: '3.0.0',
//         info: {
//           title: 'SheNergy API',
//           version: '1.0.0',
//           description: 'API documentation for SheNergy application',
//         },
//         servers: [
//           {
//             url: `http://localhost:${this.port}`,
//             description: 'Development server',
//           },
//         ],
//         components: {
//           schemas: {
//             Vehicle: {
//               type: 'object',
//               properties: {
//                 vin: { type: 'string' },
//                 model: { type: 'string' },
//                 year: { type: 'number' }
//               }
//             },
//             Customer: {
//               type: 'object',
//               properties: {
//                 customer_id: { type: 'string' },
//                 name: { type: 'string' },
//                 email: { type: 'string', format: 'email' },
//                 phone: { type: 'string' },
//                 username: { type: 'string' },
//                 vehicles: {
//                   type: 'array',
//                   items: {
//                     $ref: '#/components/schemas/Vehicle'
//                   }
//                 }
//               }
//             },
//             Error: {
//               type: 'object',
//               properties: {
//                 message: { type: 'string' },
//                 error: { type: 'string' }
//               }
//             }
//           }
//         }
//       },
//       apis: ['./src/routes/*.ts'],
//     };

//     const specs = swaggerJsdoc(swaggerOptions);
//     const swaggerOptionsUI = {
//       explorer: true,
//       customCss: '.swagger-ui .topbar { display: none }',
//     };
    
//     // Serve Swagger UI
// this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptionsUI));
    
//     // Serve OpenAPI JSON
//     this.app.get('/api-docs.json', (req: Request, res: Response) => {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(specs);
//     });
    
//     // Logging
//     if (process.env.NODE_ENV === 'development') {
//       this.app.use(morgan('dev'));
//     }

//     // Body parser
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: true }));

//     // Static files
//     this.app.use(express.static('public'));
//   }

//   private initializeRoutes(): void {
//     // Health check endpoint
//     this.app.get('/api/health', (req: Request, res: Response) => {
//       res.status(200).json({
//         status: 'success',
//         message: 'Server is running',
//         timestamp: new Date().toISOString()
//       });
//     });

//     // Core API routes
//     this.app.use('/api', apiRouter);

//     // Handle 404
//     this.app.use((req: Request, res: Response) => {
//       res.status(404).json({
//         status: 'error',
//         message: 'Not Found',
//         path: req.path
//       });
//     });
//   }

//   private initializeErrorHandling(): void {
//     this.app.use(errorHandler);
//   }

//   public listen(): void {
//     this.server.listen(this.port, () => {
//       console.log(`Server running in ${process.env.NODE_ENV} mode on port ${this.port}`);
//     });
//   }
// }

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createServer, Server } from 'http';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';

// Load environment variables
config();

class App {
  public app: Application;
  public port: string | number;
  public server: Server;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.server = createServer(this.app);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Body parser (MUST come before Swagger)
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Security middleware (disable CSP for Swagger)
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    this.app.use(cors());

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // ---------------- Swagger Setup ----------------
    const swaggerOptions = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'SheNergy API',
          version: '1.0.0',
          description: 'API documentation for SheNergy application',
        },
        servers: [
          {
            url: `http://localhost:${this.port}`,
            description: 'Development server',
          },
        ],
        components: {
          schemas: {
            Vehicle: {
              type: 'object',
              properties: {
                vin: { type: 'string' },
                model: { type: 'string' },
                year: { type: 'number' },
              },
            },
            Customer: {
              type: 'object',
              properties: {
                customer_id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' },
                username: { type: 'string' },
                vehicles: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Vehicle',
                  },
                },
              },
            },
            Error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                error: { type: 'string' },
              },
            },
          },
        },
      },
      apis: ['./src/routes/**/*.ts'],
    };

    const specs = swaggerJsdoc(swaggerOptions);

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        explorer: true,
        customSiteTitle: 'SheNergy API Docs',
      })
    );

    // OpenAPI JSON
    this.app.get('/api-docs.json', (_: Request, res: Response) => {
      res.json(specs);
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/api/health', (_: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use('/api', apiRouter);

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: 'Not Found',
        path: req.path,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
