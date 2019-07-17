import QS from 'querystring'
import URL from 'url'

export const urlQuery = {
  prepend(url: string, data?: object) {
    const { host, pathname, protocol, query } = URL.parse(url)
    return URL.format({
      host,
      pathname,
      protocol,
      query: Object.assign({}, data, QS.parse(query || ''))
    })
  },
  append(url: string, data?: object) {
    const { host, pathname, protocol, query } = URL.parse(url)
    return URL.format({
      host,
      pathname,
      protocol,
      query: Object.assign({}, QS.parse(query || ''), data)
    })
  }
}
