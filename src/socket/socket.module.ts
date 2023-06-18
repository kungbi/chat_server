import { Module } from '@nestjs/common';
import { Observer } from './socket.gateway';
import { ChatroomService } from 'src/chatroom/chatroom.service';

@Module({
  providers: [Observer, ChatroomService],
})
export class SocketModule {}
