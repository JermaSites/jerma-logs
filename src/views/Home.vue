<template>
  <div>
  </div>
</template>

<script>
import { db } from '@/db'

export default {
  name: 'Home',
  data () {
    return {
      messages: []
    }
  },
  firestore: {
    messages: db.collection('messages')
  }
}
</script>
