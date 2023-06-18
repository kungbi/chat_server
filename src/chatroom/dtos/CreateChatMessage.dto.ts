import { CoreOutput } from 'src/common/dtos/CoreOutput.dto';

export class CreateChatMessageInput {
  userId: number;
  message: string;
}
export class CreateChatMessageOutput extends CoreOutput {}
