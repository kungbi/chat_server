import { CoreOutput } from 'src/common/dtos/CoreOutput.dto';

export class LoginInput {
  username: string;
}

export class LoginOutput extends CoreOutput {
  userId?: number;
  username?: string;
}
