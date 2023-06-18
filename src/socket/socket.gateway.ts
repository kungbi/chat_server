import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomService } from 'src/chatroom/chatroom.service';

interface MessageInterface {
  userId: number;
  friendId: number;
  message: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Observer implements OnGatewayDisconnect {
  constructor(private readonly chatroomService: ChatroomService) {}

  @WebSocketServer()
  server: Server;
  sockets: { key: number; socket: Socket }[] = [];

  handleDisconnect(client: Socket) {
    this.sockets = this.sockets.filter((element) => element.socket !== client);
  }

  @SubscribeMessage('message')
  message(@MessageBody() body: MessageInterface): {
    result: boolean;
    message?: string;
  } {
    // 상대방 socket 찾기
    let friendSocket: Socket | null = null;
    for (let i = 0; i < this.sockets.length; i++) {
      if (this.sockets[i].key === body.friendId) {
        friendSocket = this.sockets[i].socket;
      }
    }
    if (!friendSocket) {
      return {
        result: false,
        message: '상대방 소켓이 등록되지 않았습니다.',
      };
    }

    // 메시지 전송
    friendSocket.emit('message', body);

    // 메시지 저장
    const createChatMessageResult = this.chatroomService.createChatMessage(
      body.friendId,
      {
        message: body.message,
        userId: body.userId,
      },
    );
    if (!createChatMessageResult.result) {
      return {
        result: false,
        message: createChatMessageResult.message,
      };
    }

    return {
      result: true,
    };
  }

  @SubscribeMessage('connection')
  connection(
    @MessageBody() body: { username: string; userId: number },
    @ConnectedSocket() client: Socket,
  ): any {
    if (!this.sockets.some((entry) => entry.key === body.userId)) {
      this.sockets.push({
        key: body.userId,
        socket: client,
      });
    }

    return 1;
  }
}
