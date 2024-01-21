import { Request, Response, NextFunction } from 'express';

const try_and_catch_handler = (request_handler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(request_handler(req, res, next)).catch((error) => {
          console.error('Error:', error); 
          return res.status(500).json({
              status: 'failed',
              message: 'Internal Server Error',
          });
      });
  };
};

export default try_and_catch_handler; 