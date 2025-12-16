import axios from 'axios'
import { ReactiveAxiosFactory } from './reactive-axios/reactive-axios-factory'

const baseURL = import.meta.env.VITE_API_BASE_URL
console.log('VITE_API_BASE_URL =', import.meta.env.VITE_API_BASE_URL)
const instance = axios.create({
  baseURL,
  validateStatus: () => true, //2xx, 3xx, 4xx 모두 성공으로 간주
})
const pathOfRecipesInstance = new ReactiveAxiosFactory(instance)

export function pathOfRecipesApi() {
  return pathOfRecipesInstance
}
