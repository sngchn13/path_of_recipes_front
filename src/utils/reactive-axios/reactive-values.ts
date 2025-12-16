import type { AxiosRequestConfig } from 'axios'
import { type Ref, unref } from 'vue'
import type { RouteSpec } from './route-spec'
import type { PathVariables } from './path-variables'

// ref든 그냥 값이든 둘 다 허용하기 위한 헬퍼 타입
export type MaybeRef<T> = T | Ref<T>

export interface ReactiveValues {
  pathVariables: MaybeRef<PathVariables>
  queries: MaybeRef<Record<string, string>>
  headers: MaybeRef<Record<string, string>>
  data: MaybeRef<unknown>
}

export function toAxiosRequestConfig(
  routeSpec: RouteSpec,
  reactiveValues: ReactiveValues,
): AxiosRequestConfig {
  const pathVars = unref(reactiveValues.pathVariables)

  return {
    url: pathVars.buildUrl(routeSpec.pathTemplate),
    method: unref(routeSpec.method),
    params: unref(reactiveValues.queries),
    headers: unref(reactiveValues.headers),
    data: unref(reactiveValues.data),
  }
}
