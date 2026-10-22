import 'reflect-metadata';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoomsService } from '../src/rooms.service';

test('lists only rooms the caller belongs to', () => {
  assert.deepEqual(new RoomsService().list('demo-host'), [{ id: 'room-001', name: 'WebRTC practice' }]);
});
test('stores a member message with server-generated identity and timestamp', () => {
  const service = new RoomsService();
  const message = service.create('room-001', 'demo-host', 'Hello');
  assert.equal(message.authorId, 'demo-host');
  assert.match(message.id, /^[0-9a-f-]{36}$/);
  assert.ok(Number.isFinite(Date.parse(message.createdAt)));
  assert.deepEqual(service.getMessages('room-001', 'demo-viewer'), [message]);
});
test('nonmember cannot write', () => {
  const service = new RoomsService();
  assert.throws(() => service.create('room-001', 'outsider', 'Hello'), ForbiddenException);
  assert.deepEqual(service.getMessages('room-001', 'demo-host'), []);
});
test('nonmember cannot read', () => {
  assert.throws(() => new RoomsService().getMessages('room-001', 'outsider'), ForbiddenException);
});
test('missing room gives not found', () => {
  assert.throws(() => new RoomsService().create('missing', 'demo-host', 'Hello'), NotFoundException);
});
test('new service instance loses memory data', () => {
  new RoomsService().create('room-001', 'demo-host', 'Hello');
  assert.deepEqual(new RoomsService().getMessages('room-001', 'demo-host'), []);
});
