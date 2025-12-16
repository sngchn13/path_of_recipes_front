import type { AxiosResponse, HttpStatusCode } from 'axios'

export interface ReactiveOption {
  /**
   * 컴포넌트가 마운트될 때 바로 요청을 실행할지 여부
   */
  immediate?: boolean

  registerWatch?: boolean

  /**
   * HTTP 상태코드별 콜백 맵
   * 예: { 200: res => ..., 404: res => ... }
   */
  callbacks?: Map<HttpStatusCode, (response: AxiosResponse) => void>
}
