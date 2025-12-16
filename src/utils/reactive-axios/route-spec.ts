export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export interface RouteSpec {
  pathTemplate: string
  method: HttpMethod
}
