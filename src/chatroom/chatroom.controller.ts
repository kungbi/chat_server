import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';

import {
  CreateChatMessageInput,
  CreateChatMessageOutput,
} from './dtos/CreateChatMessage.dto';
import {
  GetChatMessageInput,
  GetChatMessageOutput,
} from './dtos/GetChatMessage.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get(':userId/:friendId')
  getChatMessage(@Param() input: GetChatMessageInput): GetChatMessageOutput {
    return this.chatroomService.getChatMessage(input);
  }

  @Post(':friendId')
  createChatMessage(
    @Param('friendId') friendId: number,
    @Body() input: CreateChatMessageInput,
  ): CreateChatMessageOutput {
    return this.chatroomService.createChatMessage(friendId, input);
  }
}
