<template>
  <div>
    <div class="container">
      <b-table :data="messages">
        <template slot-scope="props">
          <b-table-column field="displayName" label="Username" centered>
            {{ props.row.displayName }}
          </b-table-column>

          <b-table-column field="date" label="Date" centered>
            {{ new Date(+props.row.sentAt) }}
          </b-table-column>

          <b-table-column field="message" label="Message" centered>
            <span v-linkified>{{ props.row.message }}</span>
          </b-table-column>
        </template>
      </b-table>
    </div>
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
  computed: {
    dummyData () {
      const data = []
      for (let i = 0; i < 100; i++) {
        data.push({
          displayName: 'Test',
          sentAt: Date.now(),
          message: 'Test message'
        })
      }
      return [...this.messages, ...data]
    }
  },
  firestore: {
    messages: db.collection('messages')
  }
}
</script>
