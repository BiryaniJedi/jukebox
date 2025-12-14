import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PartyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_party')
  handleJoinParty(
    @MessageBody() partyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(partyId);
    console.log(`Client ${client.id} joined party ${partyId}`);
  }

  broadcastSongAdded(partyId: string, song: any) {
    this.server.to(partyId).emit('song_added', song);
  }

  broadcastSongDeleted(partyId: string, song: any) {
    this.server.to(partyId).emit('song_deleted', song);
  }
}
