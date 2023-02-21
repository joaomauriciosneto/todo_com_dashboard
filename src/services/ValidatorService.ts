import { NextFunction } from 'express';
import { Types } from 'mongoose';
import IdInvalidException from '../errors/IdInvalidException';

class ValidatorService {
  public validateId(id: string, next: NextFunction): boolean {
    if (!Types.ObjectId.isValid(id)) {
      next(new IdInvalidException());
      return true;
    }
    return false;
  }
}

export default new ValidatorService();
