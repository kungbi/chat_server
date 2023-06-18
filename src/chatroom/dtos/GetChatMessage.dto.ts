import { CoreOutput } from 'src/common/dtos/CoreOutput.dto';
import MessageEntity from '../entities/message.entity';

export class GetChatMessageInput {
  friendId: number;
  userId: number;
}
export class GetChatMessageOutput extends CoreOutput {
  messageList?: MessageEntity[];
}
