import type { AxiosInstance } from 'axios'
import type { ReactiveValues } from './reactive-values'
import type { ReactiveOption } from './reactive-option'
import type { RouteSpec } from './route-spec'
import { ReactiveAxios } from './reactive-axios'

//todo 이놈은 인스턴스를 인수로 받아서 보관하는 놈. 여기에 url, 매개변수등을 주면 그걸로 axios wrapper가 만들어짐.
export class ReactiveAxiosFactory {
  private axiosInstance: AxiosInstance

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance
  }

  private createReactiveAxios(
    routeSpec: RouteSpec,
    values: ReactiveValues,
    option: ReactiveOption,
  ) {
    return new ReactiveAxios(this.axiosInstance, routeSpec, values, option)
  }

  get(templateUrl: string, values: ReactiveValues, option: ReactiveOption) {
    const routeSpec: RouteSpec = { pathTemplate: templateUrl, method: 'get' }
    return this.createReactiveAxios(routeSpec, values, option)
  }

  post(templateUrl: string, values: ReactiveValues, option: ReactiveOption) {
    const routeSpec: RouteSpec = { pathTemplate: templateUrl, method: 'post' }
    return this.createReactiveAxios(routeSpec, values, option)
  }

  put(templateUrl: string, values: ReactiveValues, option: ReactiveOption) {
    const routeSpec: RouteSpec = { pathTemplate: templateUrl, method: 'put' }
    return this.createReactiveAxios(routeSpec, values, option)
  }

  delete(templateUrl: string, values: ReactiveValues, option: ReactiveOption) {
    const routeSpec: RouteSpec = { pathTemplate: templateUrl, method: 'delete' }
    return this.createReactiveAxios(routeSpec, values, option)
  }

  patch(templateUrl: string, values: ReactiveValues, option: ReactiveOption) {
    const routeSpec: RouteSpec = { pathTemplate: templateUrl, method: 'patch' }
    return this.createReactiveAxios(routeSpec, values, option)
  }
}
