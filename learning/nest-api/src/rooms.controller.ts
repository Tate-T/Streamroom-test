import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto';
import { RoomsService } from './rooms.service';

// Local-only fixture, NOT authentication. Never accept authorId from the body.
const DEMO_USER_ID = 'demo-host';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  list() { return this.rooms.list(DEMO_USER_ID); }

  @Get(':id/messages')
  messages(@Param('id') roomId: string) {
    return this.rooms.getMessages(roomId, DEMO_USER_ID);
  }

  @Post(':id/messages')
  create(@Param('id') roomId: string, @Body() dto: CreateMessageDto) {
    return this.rooms.create(roomId, DEMO_USER_ID, dto.text);
  }
}
