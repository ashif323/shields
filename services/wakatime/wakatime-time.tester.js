import { createServiceTester } from '../tester.js'

export const t = await createServiceTester()

t.create('user badge')
  .get('/user/test-id.json')
  .intercept(nock =>
    nock('https://wakatime.com')
      .get('/badge/user/test-id.svg')
      .reply(200, `<svg><text>1,200 hrs 10 mins</text></svg>`),
  )
  .expectBadge({
    label: 'wakatime',
    message: '1,200 hrs 10 mins',
  })

t.create('invalid response')
  .get('/user/test-id.json')
  .intercept(nock =>
    nock('https://wakatime.com')
      .get('/badge/user/test-id.svg')
      .reply(200, `<svg></svg>`),
  )
  .expectBadge({
    label: 'wakatime',
    message: 'invalid',
  })
