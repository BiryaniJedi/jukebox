/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { Song } from '../songs/song.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PartyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    //TODO auth checks
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    //TODO auth checks
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_party')
  handleJoinParty(
    @MessageBody() partyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (
      'joinedParties' in client.data &&
      client.data.joinedParties.has(partyId)
    ) {
      console.log(`Client ${client.id} has already joined party ${partyId}`);
      return;
    } else {
      if (!('joinedParties' in client.data)) {
        client.data.joinedParties = new Set<string>();
      }
      void client.join(partyId);
      client.data.joinedParties.add(partyId);
      console.log(`Client ${client.id} joined party ${partyId}`);
    }
  }

  broadcastSongAdded(partyId: string, song: Song) {
    this.server.to(partyId).emit('song_added', song);
  }

  broadcastSongDeleted(partyId: string, song: Song) {
    this.server.to(partyId).emit('song_deleted', song);
  }

  broadcastSongAddFailed(partyId: string, song: Song) {
    this.server.to(partyId).emit('song_add_failed', song);
  }
}
