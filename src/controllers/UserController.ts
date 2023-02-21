import { NextFunction, Request, Response } from 'express';
import Controller from './Controller';
import User from '../schemas/User';
import ValidatorService from '../services/ValidatorService';
import HttpStatusCode from '../responses/HttpStatusCode';
import ServerErrorException from '../errors/ServerErrorException';
import IdInvalidException from '../errors/IdInvalidException';
import NoContentException from '../errors/NoContentException';

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
    try {
      const users = await User.find();

      if (users.length === 0) {
        return res.status(400).send({
          msg: 'No users!',
        });
      }

      return res.status(200).send(users);
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;

      if (ValidatorService.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new IdInvalidException());
      }

      const user = await User.findById(id);

      return res.status(200).send(user);
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const user = await User.create(req.body);

      return res.status(201).send(user);
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;

      if (ValidatorService.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new IdInvalidException());
      }

      const user = await User.findByIdAndUpdate(id, req.body, () => {});

      return res.status(200).send(user);
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;

      if (ValidatorService.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new IdInvalidException());
      }

      const user = await User.findById(id);

      if (user) {
        user.deleteOne();
        return res.send(user);
      }

      return res.status(HttpStatusCode.NO_CONTENT).send(new NoContentException());
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }
}

export default UserController;
