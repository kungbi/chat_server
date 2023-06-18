import Entity from '../../../DatabaseModule/entity/Entity';
import { CoreOutput } from 'src/common/dtos/CoreOutput.dto';

export class FindFriendListInput {
  userId: number;
}

export class FindFriendListOutput extends CoreOutput {
  friends?: Entity[];
}
