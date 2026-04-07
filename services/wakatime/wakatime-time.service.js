import { BaseService, pathParams } from '../index.js'

export default class WakaTimeBadge extends BaseService {
  static category = 'activity'

  static route = {
    base: 'wakatime',
    pattern: ':type(user|project)/:id',
  }

  static openApi = {
    '/wakatime/{type}/{id}': {
      get: {
        summary: 'WakaTime coding time badge',
        parameters: [
          ...pathParams({
            name: 'type',
            example: 'user',
          }),
          ...pathParams({
            name: 'id',
            example: '73d84531-5bb3-4938-91c9-5ca9e6507df9',
          }),
        ],
      },
    },
  }

  static _cacheLength = 3600

  static defaultBadgeData = {
    label: 'wakatime',
    color: 'blue',
  }

  async fetch({ type, id }) {
    const url = `https://wakatime.com/badge/${type}/${id}.svg`
    const { buffer } = await this._request({ url })
    return buffer.toString()
  }

  extractTime(svg) {
    const match = svg.match(/>([\d,]+\s+hrs?.*?)</i)
    return match ? match[1] : null
  }

  async handle({ type, id }) {
    const svg = await this.fetch({ type, id })
    const time = this.extractTime(svg)

    if (!time) {
      return this.constructor.render({
        message: 'invalid',
        color: 'red',
      })
    }

    return this.constructor.render({
      message: time,
      color: 'blue',
    })
  }
}
