import { CoreOutput } from 'src/common/dtos/CoreOutput.dto';

export class AddFriendInput {
  userId: number;
  friendId: number;
}
export class AddFriendOutput extends CoreOutput {}
