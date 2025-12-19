/**
 * 문자열에서 괄호로 묶인 내용과 숫자를 #으로 치환
 * @param str - 처리할 문자열
 * @returns 처리된 문자열
 *
 * @example
 * replacePlaceholders("Adds (10-20) to (30-40) Fire Damage")
 * // "Adds # to # Fire Damage"
 *
 * @example
 * replacePlaceholders("10% increased Attack Speed")
 * // "#% increased Attack Speed"
 *
 * @example
 * replacePlaceholders("+(10-20) to Strength")
 * // "+# to Strength"
 */
export function replacePlaceholders(str: string): string {
  // 1. ()로 묶인 모든 것을 #으로 치환
  let result = str.replace(/\([^)]*\)/g, '#')

  // 2. 수를 #으로 치환 (정수 및 소수점 포함)
  result = result.replace(/\d+(\.\d+)?/g, '#')

  return result
}
