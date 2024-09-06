import antfu from '@antfu/eslint-config'

export default antfu({
  lessOpinionated: false,
  ignores: [
    'functions/lib',
    'public',
  ],
})
