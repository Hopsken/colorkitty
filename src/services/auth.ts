import { request } from '@/utilities'
import { baseUrl } from '@/config'
import { User } from '@/types'

export interface LoginPayload {
  username: string
  password: string
}

export interface SignupPayload {
  username: string
  password: string
  email: string
}

export type UpdateUserInfoPayload = Partial<User> & { password: string }

export const getUser = () => {
  return request.get(`${baseUrl}/user`)
}

export const login = (
  payload: LoginPayload
) => {
  return request.post(
    `${baseUrl}/login`,
    JSON.stringify(payload)
  )
}

export const logout = () => {
  // return Auth.signOut()
}

export const signup = (
  payload: SignupPayload
) => {
  return request.post(
    `${baseUrl}/register`,
    JSON.stringify(payload)
  )
}

export const updateUserInfo = (
  payload: UpdateUserInfoPayload
) => {
  return request.put(
    `${baseUrl}/user`,
    JSON.stringify(payload)
  )
}
