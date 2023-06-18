import { Injectable } from '@nestjs/common';
import Tables from '../../DatabaseModule/tables/Tables';
import Database from '../../DatabaseModule';
import MessageEntity from './entities/message.entity';
import UserEntity from 'src/login/entities/user.entity';
import {
  GetChatMessageInput,
  GetChatMessageOutput,
} from './dtos/GetChatMessage.dto';
import {
  CreateChatMessageInput,
  CreateChatMessageOutput,
} from './dtos/CreateChatMessage.dto';

@Injectable()
export class ChatroomService {
  messages: Tables<MessageEntity>;
  users: Tables<UserEntity>;

  constructor() {
    const db = Database.getConnection();
    this.messages = db.getRepository<MessageEntity>(MessageEntity);
    this.users = db.getRepository<UserEntity>(UserEntity);
  }

  private makeChatroomId(aUserId: number, bUserId: number): string {
    if (aUserId < bUserId) {
      return aUserId + '_' + bUserId;
    } else {
      return bUserId + '_' + aUserId;
    }
  }

  private getDateTime() {
    return new Date()
      .toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/,/g, '');
  }

  getChatMessage(input: GetChatMessageInput): GetChatMessageOutput {
    try {
      input.friendId = Number(input.friendId);
      input.userId = Number(input.userId);

      // 메시지 가져오기
      const messageList = this.messages.readAll({
        chatroomId: this.makeChatroomId(input.userId, input.friendId),
      });

      if (!messageList.result || !messageList.entities) {
        return {
          result: false,
          message: messageList.message,
        };
      }

      return {
        result: true,
        messageList: messageList.entities,
      };
    } catch (error) {
      return {
        result: false,
        message: error.message,
      };
    }
  }

  createChatMessage(
    friendId: number,
    input: CreateChatMessageInput,
  ): CreateChatMessageOutput {
    try {
      friendId = Number(friendId);
      input.userId = Number(input.userId);

      // 친구 정보 가져오기
      const friend = this.users.readOne({
        id: friendId,
      });
      if (!friend.result || !friend.entity) {
        return {
          result: false,
          message: '없는 friendId입니다.',
        };
      }

      // 내 정보 가져오기
      const user = this.users.readOne({
        id: input.userId,
      });
      if (!user.result || !user.entity) {
        return {
          result: false,
          message: '없는 userId입니다.',
        };
      }

      const message = this.messages.create({
        chatroomId: this.makeChatroomId(friendId, input.userId),
        friendId: friendId,
        friendName: friend.entity.username,
        userId: user.entity.id,
        userName: user.entity.username,
        datetime: this.getDateTime(),
        message: input.message,
      });
      const messageSave = this.messages.save({ entity: message.entity });
      if (!messageSave.result) {
        return {
          result: false,
          message: '메시지 저장이 되지 않았습니다.',
        };
      }

      return {
        result: true,
      };
    } catch (error) {
      return {
        result: false,
        message: error.message,
      };
    }
  }
}
