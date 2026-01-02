import type { AxiosRequestConfig } from 'axios'
import { type Ref, unref } from 'vue'
import type { RouteSpec } from './route-spec'

export type MaybeRef<T> = T | Ref<T>

export interface ReactiveValues {
  pathVariables?: MaybeRef<Record<string, string>>
  queries?: MaybeRef<Record<string, string | number | boolean | (string | number)[]>>
  headers?: MaybeRef<Record<string, string>>
  data?: MaybeRef<unknown>
}

export function toAxiosRequestConfig(
  routeSpec: RouteSpec,
  reactiveValues: ReactiveValues = {},
): AxiosRequestConfig {
  const pathVars = reactiveValues.pathVariables ? unref(reactiveValues.pathVariables) : undefined
  const queries = reactiveValues.queries ? unref(reactiveValues.queries) : {}

  return {
    url: buildUrl(routeSpec.pathTemplate, pathVars),
    method: unref(routeSpec.method),
    params: queries,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          // 배열인 경우 각 값을 반복해서 추가 (mod-group-ids=1&mod-group-ids=2 형태)
          for (const item of value) {
            searchParams.append(key, String(item))
          }
        } else if (value !== null && value !== undefined) {
          searchParams.append(key, String(value))
        }
      }
      return searchParams.toString()
    },
    headers: unref(reactiveValues.headers ?? {}),
    data: unref(reactiveValues.data ?? undefined),
  }
}

function buildUrl(templateUrl: string, pathVariables?: Record<string, string>): string {
  const vars = pathVariables ?? {}

  return templateUrl.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = vars[key]
    if (value === undefined) throw new Error(`Missing path variable: ${key}`)
    return encodeURIComponent(value)
  })
}
