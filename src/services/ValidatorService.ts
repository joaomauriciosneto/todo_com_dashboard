import { NextFunction } from 'express';
import { Types } from 'mongoose';

class ValidatorService {
  public validateId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) {
      return true;
    }
    return false;
  }
}

export default new ValidatorService();
