import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class NoContentException extends HttpException {
  constructor() {
    super(HttpStatusCode.NO_CONTENT, 'Não foi localizado o registro!');
  }
}

export default NoContentException;
