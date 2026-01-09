declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  export const serve: RequestHandler[];
  export function setup(
    swaggerDoc: object,
    options?: object,
    customCss?: string,
    customJs?: string,
    customfavIcon?: string,
    swaggerUrl?: string,
    swaggerUrls?: object[],
    customSiteTitle?: string
  ): RequestHandler;

  const _default: {
    serve: RequestHandler[];
    setup: typeof setup;
  };

  export default _default;
}
