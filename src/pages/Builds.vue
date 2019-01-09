<template>
  <div class="flex">
    <div id="content">
      <div id="metadata"></div>
      <fieldset>
        <legend>Build Duration History</legend>
        <div id="duration-history"></div>
      </fieldset>
      <div id="table-builds">
        <table>
          <thead>
          <tr>
            <th>Build</th>
            <th>Duration</th>
            <th>Started At</th>
            <th>Commit</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="build in builds" :key="build.id" @click="selectBuild(build.id)">
              <td :class="build.state" :title="build.state"><state-icon :status="build.state"></state-icon>#{{build.number}}</td>
              <td><duration :start="build.started_at" :finish="build.finished_at"></duration></td>
              <td><datetime :value="build.started_at"></datetime></td>
              <td class="can-wrap"><commit :target="build"></commit></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import StateIcon from '../components/StateIcon.vue'
import Datetime from '../components/Datetime.vue'
import Duration from '../components/Duration.vue'
import Commit from '../components/Commit.vue'

export default {
  name: 'Builds',
  created: function() {
    this.$store.dispatch('reloadBuilds')
  },
  computed: {
    builds() { return this.$store.state.builds }
  },
  components: {
    StateIcon, Datetime, Duration, Commit
  },
  methods: {
    selectBuild(id) {
      this.$router.push(`/build/${id}`)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
