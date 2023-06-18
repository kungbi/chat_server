import Entity from '../../../DatabaseModule/entity/Entity';

export default class MessageEntity extends Entity {
  id = -1;
  chatroomId = '';
  userId = -1;
  userName = '';
  friendId = -1;
  friendName = '';
  message = '';
  datetime = '';
}
