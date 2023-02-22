import App from './app';
import TaskController from './controllers/TaksController';
import UserController from './controllers/UserController';

const app = new App([
  new UserController(),
  new TaskController(),
]);

app.listen(3333);
