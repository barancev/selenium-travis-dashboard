<template>
  <div class="flex">
    <builds-sidebar></builds-sidebar>
    <div id="content">
      <div id="metadata" v-if="build">
        <div id="commit-info">
          <commit :target="build"></commit>
        </div>
        <div id="build-info main-info">
          <state-icon :status="build.state"></state-icon><span class="info">Build #{{build.number}}</span>
          <duration :start="build.started_at" :finish="build.finished_at"></duration>
          <datetime :value="build.started_at"></datetime>
        </div>        
      </div>
      <fieldset>
        <legend>Build Duration History</legend>
        <div id="duration-history"></div>
      </fieldset>
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
            <tr v-for="job in jobs" :key="job.id">
              <td class="info" :class="job.state" :title="job.state"><state-icon :status="job.state"></state-icon>#{{job.number}}</td>
              <td class="duration"><duration :start="job.started_at" :finish="job.finished_at"></duration></td>
              <td class="os"><os-icon :os="job.os"></os-icon></td>
              <td class="language"><language-icon :language="job.language"></language-icon></td>
              <td class="env can-wrap"><i class="fas fa-cogs"></i>{{ job.env }}</td>
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
import BuildsSidebar from '../components/BuildsSidebar.vue'

export default {
  name: 'Build',
  watch: {
    '$route' (to, from) {
      this.$store.commit('reloadBuilds')
      this.$store.commit('setCurrentBuild', to.params.id)
    }
  },
  created: function() {
    this.$store.commit('setCurrentBuild', this.id)
  },
  computed: {
    id() { return this.$route.params.id },
    build() { return this.$store.state.currentBuild },
    jobs() { return this.$store.state.currentBuildJobs }
  },
  components: {
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, BuildsSidebar
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
</style>
