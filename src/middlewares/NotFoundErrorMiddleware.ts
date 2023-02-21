import { Request, Response } from 'express';
import responseNotFound from '../responses/ResponseNotFound';

function notFoundErrorMiddlware(req: Request, res: Response) {
  return responseNotFound(res);
}

export default notFoundErrorMiddlware;
