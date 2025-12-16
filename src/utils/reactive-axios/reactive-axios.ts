import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ReactiveValues } from './reactive-values'
import { toAxiosRequestConfig } from './reactive-values'
import type { ReactiveOption } from './reactive-option'
import { ref, unref, watch, type Ref } from 'vue'
import type { RouteSpec } from './route-spec'

export class ReactiveAxios {
  isLoading: Ref<boolean>
  responseData: Ref<unknown>
  response: Ref<AxiosResponse | null>
  execute: (requestBody: unknown | null) => Promise<void>

  constructor(
    instance: AxiosInstance,
    routeSpec: RouteSpec,
    values: ReactiveValues,
    option: ReactiveOption,
  ) {
    this.isLoading = ref(false)
    this.responseData = ref(null)
    this.response = ref<AxiosResponse | null>(null)

    // 요청 실행 함수
    this.execute = async (requestBody: unknown | null) => {
      this.isLoading.value = true

      try {
        const axiosConfig = toAxiosRequestConfig(routeSpec, values)

        const data = unref(requestBody)
        if (data != null) axiosConfig.data = data

        const res = await instance.request(axiosConfig)
        this.response.value = res
        this.responseData.value = res.data

        // 상태코드별 콜백 실행
        const callback = option.callbacks?.get(res.status)
        if (callback != null) {
          callback(res)
        }
      } catch (error) {
        //상태코드가 아닌 에러
        console.log('err=', error)
      } finally {
        this.isLoading.value = false
      }
    }

    // 옵션에 따라 values의 내부 값 변화를 감시하여 자동 재요청
    if (option.registerWatch) {
      watch(
        () => ({
          pathVariables: unref(values.pathVariables),
          queries: unref(values.queries),
          headers: unref(values.headers),
          data: unref(values.data),
        }),
        () => {
          void this.execute(null)
        },
        { deep: true },
      )
    }

    // 즉시 실행 옵션
    if (option.immediate) {
      void this.execute(null)
    }
  }
}
