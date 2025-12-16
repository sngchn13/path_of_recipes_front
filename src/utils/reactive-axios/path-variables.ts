export class PathVariables {
  private readonly values: Map<string, string>

  constructor()
  constructor(values: Map<string, string>)
  constructor(values?: Map<string, string>) {
    this.values = values ? new Map(values) : new Map()
  }

  set(key: string, value: string): void {
    this.values.set(key, value)
  }

  get(key: string): string | undefined {
    return this.values.get(key)
  }

  //templateUrl의 형태는 /users/{user-id}/posts/{post-id}
  buildUrl(templateUrl: string): string {
    let result = templateUrl

    const keys = templateUrl.match(/\{([^}]+)\}/g)?.map((s) => s.slice(1, -1)) ?? []

    for (const key of keys) {
      const value = this.values.get(key)
      if (value === undefined) throw new Error(`Missing path variable: ${key}`)
      result = result.split(`{${key}}`).join(encodeURIComponent(value))
    }

    return result
  }
}
