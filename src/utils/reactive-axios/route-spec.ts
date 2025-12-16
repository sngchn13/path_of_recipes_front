export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export interface RouteSpec {
  /** /users/{user-id}/posts/{post-id} */
  pathTemplate: string
  method: HttpMethod
}
