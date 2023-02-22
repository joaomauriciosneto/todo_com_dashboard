import { NextFunction, Request, Response } from 'express';
import Controller from './Controller';
import ValidatorService from '../services/ValidatorService';
import ServerErrorException from '../errors/ServerErrorException';
import NoContentException from '../errors/NoContentException';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
import Task, { TaskInterface } from '../schemas/Task';
import TaskService from '../services/TaskService';

class TaskController extends Controller {
  constructor() {
    super('/task');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/:filter/:_id`, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      // const tasks = await Task.find(TaskService.getParamsList(req))

      const query = TaskService.getParamsList(req);

      const tasks = await Task.find(query || {});

      if (tasks.length) return responseOk(res, tasks);

      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const { id } = req.params;

      if (ValidatorService.validateId(id, next)) return;

      const task = await Task.findById(id);

      if (task) return responseOk(res, task);

      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      let task: TaskInterface | null = req.body;

      if (!task) {
        throw new Error('Taks cannot be null!');
      }

      TaskService.checkStatusFinished(task);

      task = await Task.create(task);
      task = await Task.findById(task.id).populate('responsible');

      return responseCreate(res, task);
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const { id } = req.params;

      if (ValidatorService.validateId(id, next)) return;

      let task: TaskInterface | null = req.body;

      if (!task) {
        throw new Error('Task cannot be null');
      }

      TaskService.checkStatusFinished(task);

      task = await Task.findByIdAndUpdate(id, task, () => {});

      if (task) {
        task = await Task.findById(task.id).populate('responsible');
        return responseOk(res, task);
      }

      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const { id } = req.params;

      if (ValidatorService.validateId(id, next)) return;

      const task = await Task.findById(id);

      if (task) {
        task.deleteOne();
        return responseOk(res, task);
      }

      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }
}

export default TaskController;
