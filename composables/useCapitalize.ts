export function useCapitalize() {
  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  return { capitalize }
}
