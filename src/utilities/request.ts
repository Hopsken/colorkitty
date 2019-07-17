import now from 'lodash/now'

import { urlQuery } from '@/utilities'

type RequestBody = RequestInit['body'] | undefined

export interface Request {
  <T>(url: string, options: RequestInit): Promise<T>
  get<T>(
    url: string,
    query?: object,
    headers?: HeadersInit,
    options?: RequestInit
  ): Promise<T>
  post<T>(url: string, body?: RequestBody, headers?: HeadersInit): Promise<T>
  put<T>(url: string, body?: RequestBody, headers?: HeadersInit): Promise<T>
  delete<T>(url: string, body?: RequestBody, headers?: HeadersInit): Promise<T>
}

export const request = ((url: string, options: RequestInit) => {
  options = {
    ...options,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...options.headers
    }
  }
  return fetch(url, options).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res.json()
    } else {
      const error = new Error(res.statusText)
      throw error
    }
  })
}) as Request

request.get = <T>(
  url: string,
  body?: object,
  headers: any = {},
  options?: RequestInit
) => {
  url = urlQuery.prepend(url, { _: now() }) // 避免 `_` 参数被覆盖
  url = urlQuery.append(url, body)
  return request<T>(url, {
    ...options,
    headers,
    method: 'GET'
  })
}

request.post = <T>(
  url: string,
  body?: RequestBody,
  headers: any = { 'Content-Type': 'application/json' }
) => {
  return request<T>(url, {
    body,
    headers,
    method: 'POST'
  })
}

request.put = <T>(
  url: string,
  body?: RequestBody,
  headers: any = { 'Content-Type': 'application/json' }
) => {
  return request<T>(url, {
    body,
    headers,
    method: 'PUT'
  })
}

request.delete = <T>(
  url: string,
  body?: RequestBody,
  headers: any = { 'Content-Type': 'application/json' }
) => {
  return request<T>(url, {
    body,
    headers,
    method: 'DELETE'
  })
}
