import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { FriendModule } from './friend/friend.module';
import { SocketModule } from './socket/socket.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [LoginModule, FriendModule, SocketModule, ChatroomModule],
})
export class AppModule {}
