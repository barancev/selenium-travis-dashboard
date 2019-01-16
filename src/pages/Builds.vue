<template>
  <div class="flex">
    <div id="content">
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
              <td :class="build.state" :title="build.state"><state-icon :target="build"></state-icon>#{{build.number}}</td>
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
import DurationChart from '../components/DurationChart.vue'

export default {
  name: 'Builds',
  created: function() {
    this.$store.dispatch('reloadBuilds')
  },
  computed: {
    builds() { return this.$store.state.builds },
    chartData() {
      var now = new Date()
      var data = this.$store.state.builds.map(
        build => {
          return {
            id: build.id,
            number: build.number,
            state: build.state,
            duration: ((build.finished_at ? new Date(build.finished_at) : now) - new Date(build.started_at)) / 1000,
          }
        }
      )
      data.reverse()
      return data
    }
  },
  components: {
    StateIcon, Datetime, Duration, Commit, DurationChart
  },
  methods: {
    selectBuild(id) {
      this.$router.push(`/build/${id}`)
    },
    refresh() {
      if (this.$store.state.builds.filter(b => b.state === 'pending' || b.state === 'started' || b.state === 'running').length > 0) {
        this.$store.dispatch('reloadBuilds')
      }
    }
  },
  mounted: function() {
    setInterval(
      function() {
        this.refresh()
      }.bind(this),
      30000
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
