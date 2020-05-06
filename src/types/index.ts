type ObjectId<T> = string & { kind: T }
type UserSocialType =
  | 'behance'
  | 'dribbble'
  | 'instagram'
  | 'twitter'
  | 'website'
export type HexColor = string & { kind: 'hex' }

export interface User {
  _id: ObjectId<'user'>
  name: string
  email: string
  social: Record<UserSocialType, string>
  location: string
}

export interface Palette {
  _id: ObjectId<'palette'>
  name: string
  colors: HexColor[]
  creator: User
  isLiked: boolean
  createdAt: string
  updatedAt: string
  likesCount?: number
}
