import {NextFunction, Request, RequestHandler, Response} from 'express';

export function combineMiddlewares(...middlewares: RequestHandler[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    let index = 0;

    const runMiddleware = () => {
      if (index < middlewares.length) {
        middlewares[index](req, res, () => {
          index++;
          runMiddleware();
        });
      } else {
        next();
      }
    };

    runMiddleware();
  };
}
