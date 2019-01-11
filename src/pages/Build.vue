<template>
  <div class="flex">
    <builds-sidebar></builds-sidebar>
    <div id="content">
      <div id="metadata" v-if="build">
        <div id="commit-info">
          <commit :target="build"></commit>
        </div>
        <div id="build-info">
          <span :class="build.state" class="build-number"><state-icon :target="build"></state-icon><a :href="'https://travis-ci.org/SeleniumHQ/selenium/builds/'+build.id">Build #{{build.number}}</a></span>
          <duration :start="build.started_at" :finish="build.finished_at"></duration>
          <datetime :value="build.started_at"></datetime>
        </div>        
      </div>
      <duration-chart v-if="builds.length" label="Build" title="Build Duration History" :data="chartData" :current="id" route-to="/build"></duration-chart>
      <div id="table-jobs">
        <table>
          <thead>
          <tr>
            <th>Job</th>
            <th>Duration</th>
            <th>OS</th>
            <th>Language</th>
            <th>Env</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job.id" @click="selectJob(job.id)">
              <td :class="job.state" :title="job.state"><state-icon :target="job"></state-icon>{{job.number}}</td>
              <td><duration :start="job.started_at" :finish="job.finished_at"></duration></td>
              <td><os-icon :os="job.os"></os-icon></td>
              <td><language-icon :language="job.language"></language-icon></td>
              <td class="can-wrap"><environment :env="job.env"></environment></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Commit from '../components/Commit.vue'
import StateIcon from '../components/StateIcon.vue'
import Datetime from '../components/Datetime.vue'
import Duration from '../components/Duration.vue'
import OsIcon from '../components/OsIcon.vue'
import LanguageIcon from '../components/LanguageIcon.vue'
import Environment from '../components/Environment.vue'
import BuildsSidebar from '../components/BuildsSidebar.vue'
import DurationChart from '../components/DurationChart.vue'

export default {
  name: 'Build',
  watch: {
    '$route' (to, from) {
      this.$store.commit('setCurrentBuildJobs', [])
      this.$store.dispatch('setCurrentBuild', to.params.id)
    }
  },
  created: function() {
    this.$store.commit('setCurrentBuildJobs', [])
    this.$store.dispatch('setCurrentBuild', this.id)
  },
  computed: {
    builds() { return this.$store.state.builds },
    id() { return Number(this.$route.params.id) },
    build() { return this.$store.state.currentBuild },
    jobs() { return this.$store.state.currentBuildJobs },
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
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, Environment, BuildsSidebar, DurationChart
  },
  methods: {
    selectJob(id) {
      this.$router.push(`/job/${id}`)
    },
    refresh() {
      if (this.$store.state.currentBuild) {
        let state = this.$store.state.currentBuild.state
        if (state === 'pending' || state === 'started' || 'state' === 'running') {
          this.$store.dispatch('setCurrentBuild', this.id)
        }
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
#metadata {
  margin: 7px;
  padding: 5px;
  border: 1px solid #e0e0e0;
}

#metadata span {
  padding-right: 5px;
}
</style>
