import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import {
  FindFriendListInput,
  FindFriendListOutput,
} from './dtos/FindFriendList.dto';
import { AddFriendInput, AddFriendOutput } from './dtos/AddFriend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':userId')
  findFriendList(@Param() input: FindFriendListInput): FindFriendListOutput {
    return this.friendService.findFriendList(input);
  }

  @Post()
  addFriend(@Body() input: AddFriendInput): AddFriendOutput {
    return this.friendService.addFriend(input);
  }
}
