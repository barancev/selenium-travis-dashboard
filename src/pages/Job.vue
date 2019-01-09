<template>
  <div class="flex">
    <builds-sidebar></builds-sidebar>
    <jobs-sidebar></jobs-sidebar>
    <div id="content">
      <div id="metadata" v-if="job">
        <div id="commit-info">
          <commit :target="job"></commit>
        </div>
        <div id="job-info">
          <state-icon :status="job.state"></state-icon><span class="info">Job #{{job.number}}</span>
          <duration :start="job.started_at" :finish="job.finished_at"></duration>
          <datetime :value="job.started_at"></datetime>
        </div>        
      </div>
      <fieldset>
        <legend>Job Duration History</legend>
        <div id="duration-history"></div>
      </fieldset>
      <div id="table-test-classes">
        <table>
          <thead>
          <tr>
            <th>Test Class</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Skipped</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="test in tests" :key="test.id">
              <td :class="test.state" :title="test.state"><state-icon :status="test.state"></state-icon>#{{test.number}}</td>
              <td><duration :start="test.started_at" :finish="test.finished_at"></duration></td>
              <td><os-icon :os="test.os"></os-icon></td>
              <td><language-icon :language="test.language"></language-icon></td>
              <td><i class="fas fa-cogs"></i>{{ test.env }}</td>
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
import JobsSidebar from '../components/JobsSidebar.vue'

export default {
  name: 'Job',
  watch: {
    '$route' (to, from) {
      this.$store.dispatch('setCurrentJob', to.params.id)
    }
  },
  created: function() {
    this.$store.dispatch('setCurrentJob', this.id)
  },
  computed: {
    id() { return this.$route.params.id },
    job() { return this.$store.state.currentJob },
    tests() { return this.$store.state.currentJobTests }
  },
  components: {
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, BuildsSidebar, JobsSidebar
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
