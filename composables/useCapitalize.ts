function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function useCapitalize() {
  return { capitalize }
}
