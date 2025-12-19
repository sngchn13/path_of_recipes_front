import axios from 'axios'
import { ReactiveAxiosFactory } from './reactive-axios/reactive-axios-factory'

const baseURL = import.meta.env.VITE_API_BASE_URL
console.log('VITE_API_BASE_URL =', import.meta.env.VITE_API_BASE_URL)
const instance = axios.create({
  baseURL,
})
const pathOfRecipesInstance = new ReactiveAxiosFactory(instance)

export function pathOfRecipesApi() {
  return pathOfRecipesInstance
}
