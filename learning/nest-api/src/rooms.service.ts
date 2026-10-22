import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type Message = { id: string; authorId: string; text: string; createdAt: string };

@Injectable()
export class RoomsService {
  private readonly rooms = [
    { id: 'room-001', name: 'WebRTC practice', memberIds: ['demo-host', 'demo-viewer'] },
    { id: 'room-002', name: 'Private practice', memberIds: ['other-user'] },
  ];
  private readonly messages = new Map<string, Message[]>();

  list(userId: string) {
    return this.rooms.filter(room => room.memberIds.includes(userId))
      .map(({ id, name }) => ({ id, name }));
  }

  private requireMember(roomId: string, userId: string) {
    const room = this.rooms.find(item => item.id === roomId);
    if (!room) throw new NotFoundException('Room not found');
    if (!room.memberIds.includes(userId)) throw new ForbiddenException('Not a room member');
  }

  getMessages(roomId: string, userId: string): Message[] {
    this.requireMember(roomId, userId);
    return (this.messages.get(roomId) ?? []).map(message => ({ ...message }));
  }

  create(roomId: string, userId: string, text: string): Message {
    this.requireMember(roomId, userId);
    const message = { id: randomUUID(), authorId: userId, text, createdAt: new Date().toISOString() };
    this.messages.set(roomId, [...(this.messages.get(roomId) ?? []), message]);
    return { ...message };
  }
}
