import type { AxiosRequestConfig } from 'axios'
import { type Ref, unref } from 'vue'
import type { RouteSpec } from './route-spec'

export type MaybeRef<T> = T | Ref<T>

export interface ReactiveValues {
  pathVariables?: MaybeRef<Record<string, string>>
  queries?: MaybeRef<Record<string, string | number | boolean>>
  headers?: MaybeRef<Record<string, string>>
  data?: MaybeRef<unknown>
}

export function toAxiosRequestConfig(
  routeSpec: RouteSpec,
  reactiveValues: ReactiveValues = {},
): AxiosRequestConfig {
  const pathVars = reactiveValues.pathVariables ? unref(reactiveValues.pathVariables) : undefined

  return {
    url: buildUrl(routeSpec.pathTemplate, pathVars),
    method: unref(routeSpec.method),
    params: unref(reactiveValues.queries ?? {}),
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
