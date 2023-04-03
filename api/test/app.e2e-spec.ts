import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Converter without HTML (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({
        text: 'Чэшскі і польскі, Джонні, асяроддзе',
        alphabet: 0,
        alwaysJ: 2,
      })
      .expect(201)
      .expect('Чэскі й польскі, Джоньні, асяродзьдзе')
  })
})
