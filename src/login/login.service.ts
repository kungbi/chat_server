import { Injectable } from '@nestjs/common';
import DB from '../../DatabaseModule/index';
import UserEntity from './entities/user.entity';
import Tables from '../../DatabaseModule/tables/Tables';
import { LoginInput, LoginOutput } from './dtos/Login.dto';

@Injectable()
export class LoginService {
  db: DB;
  users: Tables<UserEntity>;

  constructor() {
    this.db = DB.getConnection();
    this.users = this.db.getRepository<UserEntity>(UserEntity);
  }

  // 회원가입 & 로그인
  login(input: LoginInput): LoginOutput {
    try {
      // DB 조회
      const user = this.users.readOne({
        username: input.username,
      });

      // 있으면 1
      if (user.result) {
        return {
          result: true,
          userId: user.entity.id,
          username: user.entity.username,
        };
      }

      // 없으면 생성
      const newUser = this.users.create({
        username: input.username,
      });

      const saveUser = this.users.save({
        entity: newUser.entity,
      });

      if (!saveUser.result) {
        return {
          result: false,
          message: saveUser.message,
        };
      }

      return {
        result: true,
        userId: saveUser.id,
      };
    } catch (e) {
      return {
        result: false,
        message: e.message,
      };
    }
  }

  getInfo(input: LoginInput): LoginOutput {
    try {
      // DB 조회
      const user = this.users.readOne({
        username: input.username,
      });

      if (!user.result) {
        return {
          result: false,
          message: '유저가 존재하지 않습니다.',
        };
      }

      return {
        result: true,
        userId: user.entity.id,
        username: user.entity.username,
      };
    } catch (e) {
      return {
        result: false,
        message: e.message,
      };
    }
  }
}
