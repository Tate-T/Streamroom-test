import 'reflect-metadata';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';

let app: INestApplication;
before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = module.createNestApplication();
  configureApp(app);
  await app.init();
});
after(async () => { await app?.close(); });

test('GET rooms returns only fixture membership', async () => {
  const response = await request(app.getHttpServer()).get('/rooms').expect(200);
  assert.deepEqual(response.body, [{ id: 'room-001', name: 'WebRTC practice' }]);
});
test('POST trims, creates and reads back the message', async () => {
  const posted = await request(app.getHttpServer()).post('/rooms/room-001/messages')
    .send({ text: '  Привіт API  ' }).expect(201);
  assert.equal(posted.body.text, 'Привіт API');
  assert.equal(posted.body.authorId, 'demo-host');
  const read = await request(app.getHttpServer()).get('/rooms/room-001/messages').expect(200);
  assert.ok(read.body.some((message: { id: string }) => message.id === posted.body.id));
});
for (const text of ['', '   ', 12, null, 'a'.repeat(501)]) {
  test(`invalid text rejected: ${JSON.stringify(text).slice(0, 35)}`, async () => {
    await request(app.getHttpServer()).post('/rooms/room-001/messages').send({ text }).expect(400);
  });
}
test('500 characters accepted', async () => {
  const result = await request(app.getHttpServer()).post('/rooms/room-001/messages')
    .send({ text: 'a'.repeat(500) }).expect(201);
  assert.equal(result.body.text.length, 500);
});
test('missing text rejected', async () => {
  await request(app.getHttpServer()).post('/rooms/room-001/messages').send({}).expect(400);
});
test('client cannot inject authorId', async () => {
  await request(app.getHttpServer()).post('/rooms/room-001/messages')
    .send({ text: 'Hi', authorId: 'other-user' }).expect(400);
});
test('private room rejects reading and writing', async () => {
  await request(app.getHttpServer()).get('/rooms/room-002/messages').expect(403);
  await request(app.getHttpServer()).post('/rooms/room-002/messages').send({ text: 'Hi' }).expect(403);
});
test('unknown room returns 404', async () => {
  await request(app.getHttpServer()).post('/rooms/missing/messages').send({ text: 'Hi' }).expect(404);
});
