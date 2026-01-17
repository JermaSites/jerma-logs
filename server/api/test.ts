export default defineEventHandler(async () => {
  const config = useRuntimeConfig().public

  return config
})
