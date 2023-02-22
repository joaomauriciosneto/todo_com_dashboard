import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import Task, { StatusEnum, TaskInterface } from '../schemas/Task';

export enum TaskFilterEnum {
    MY,
    OPENED,
    FINISHED,
    ALL
}

class TaskService {
  public getParamsList(req: Request): FilterQuery<TaskInterface[]> | undefined {
    const { filter, _id } = req.params;
    if (!filter) return undefined;

    if (TaskFilterEnum[TaskFilterEnum.MY] === TaskFilterEnum[filter]) return { responsible: { _id } };
    if (TaskFilterEnum[TaskFilterEnum.OPENED] === TaskFilterEnum[filter]) return { status: StatusEnum.OPEN };
    if (TaskFilterEnum[TaskFilterEnum.FINISHED] === TaskFilterEnum[filter]) return { status: StatusEnum.FINISHED };
    if (TaskFilterEnum[TaskFilterEnum.ALL] === TaskFilterEnum[filter]) return undefined;
  }

  public checkStatusFinished(task: TaskInterface) {
    if (StatusEnum.FINISHED === task.status) task.concluded = new Date();
  }
}

export default new TaskService();
