import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Controller from './Controller';
import User from '../schemas/User';
import ValidatorService from '../services/ValidatorService';

class UserController extends Controller {
  constructor() {
    super('/user');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(400).send({
        msg: 'No users!',
      });
    }

    return res.status(200).send(users);
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (ValidatorService.validateId(id)) {
      return res.status(404).send({
        msg: 'User not found!',
      });
    }

    const userExist = await User.find();

    if (userExist.length === 0) {
      return res.status(400).send({
        msg: 'No users!',
      });
    }

    const user = await User.findById(id);

    return res.status(200).send(user);
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (ValidatorService.validateId(id)) {
      return res.status(404).send({
        msg: 'User not found!',
      });
    }

    const user = await User.findByIdAndUpdate(id, req.body, () => {});

    return res.status(200).send(user);
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (ValidatorService.validateId(id)) {
      return res.status(404).send({
        msg: 'User not found!',
      });
    }

    const user = await User.findById(id);

    if (user) {
      user.deleteOne();
      return res.status(200).send({
        msg: 'User deleted successfully!',
        data: user,
      });
    }
    return res.status(204).send();
  }
}

export default UserController;
