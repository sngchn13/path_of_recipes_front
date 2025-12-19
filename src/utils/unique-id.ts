let counter = 0

/**
 * vue-flow 노드/엣지 등에 사용할 간단한 유니크 ID 생성기
 * - 메모리 내에서만 유니크하면 되는 용도
 * - `prefix`를 주면 구분하기 쉽도록 앞에 붙여준다 (예: node_1, edge_2)
 */
export function createUniqueId(prefix = 'id'): string {
  counter += 1
  const base = `${Date.now().toString(36)}_${counter.toString(36)}`
  return `${prefix}_${base}`
}
