import { Injectable } from '@nestjs/common';
import Tables from '../../DatabaseModule/tables/Tables';
import FriendEntity from './entities/friend.entity';
import Database from '../../DatabaseModule';
import {
  FindFriendListInput,
  FindFriendListOutput,
} from './dtos/FindFriendList.dto';
import { AddFriendInput, AddFriendOutput } from './dtos/AddFriend.dto';
import UserEntity from 'src/login/entities/user.entity';

@Injectable()
export class FriendService {
  friends: Tables<FriendEntity>;
  users: Tables<UserEntity>;

  constructor() {
    const db = Database.getConnection();
    this.friends = db.getRepository<FriendEntity>(FriendEntity);
    this.users = db.getRepository<UserEntity>(UserEntity);
  }

  findFriendList(input: FindFriendListInput): FindFriendListOutput {
    try {
      input.userId = Number(input.userId);
      const friendList = this.friends.readAll({ userId: input.userId });
      if (!friendList.result || !friendList.entities) {
        return {
          result: false,
          message: 'findAll() -' + friendList.message,
        };
      }

      const found: UserEntity[] = [];
      friendList.entities.forEach((entity) => {
        const friend = this.users.readOne({
          id: entity.friendId,
        });
        found.push({ id: entity.friendId, username: friend.entity.username });
      });

      return {
        result: true,
        friends: found,
      };
    } catch (e) {
      return {
        result: false,
        message: e,
      };
    }
  }

  addFriend(input: AddFriendInput): AddFriendOutput {
    try {
      input.userId = Number(input.userId);
      input.friendId = Number(input.friendId);

      if (input.userId === input.friendId) {
        return {
          result: false,
          message: 'addFriend - 본인은 친구추가 할 수 없습니다.',
        };
      }

      // userId가 존재하는지 확인
      if (
        !this.users.readOne({
          id: input.userId,
        }).result
      ) {
        return {
          result: false,
          message: 'addFriend - 로그인 정보가 잘 못 되었습니다.',
        };
      }
      // friendId가 존재하는지 확인
      if (
        !this.users.readOne({
          id: input.friendId,
        }).result
      ) {
        return {
          result: false,
          message: 'addFriend - 추가하려는 친구 id가 없습니다.',
        };
      }

      // 이미 친구가 되어있는지 확인
      if (
        this.friends.readOne({
          userId: input.userId,
          friendId: input.friendId,
        }).result
      ) {
        return {
          result: false,
          message: 'addFriend - 이미 친구추가가 되어있습니다.',
        };
      }

      // 친구 추가 진행
      const friend = this.friends.create({
        userId: input.userId,
        friendId: input.friendId,
      });
      this.friends.save({ entity: friend.entity });

      return {
        result: true,
      };
    } catch (e) {
      return {
        result: false,
        message: e.message,
      };
    }
  }
}
