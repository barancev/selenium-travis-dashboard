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
            <tr v-for="(value, name) in tests" :key="name">
              <td>{{ name }}</td>
              <td><span class="passed" v-if="value.passed">{{ value.passed }}</span></td>
              <td><span class="failed" v-if="value.failed">{{ value.failed }}</span></td>
              <td><span class="skipped" v-if="value.skipped">{{ value.skipped }}</span></td>
              <td>{{ value.passed + value.failed + value.skipped }}</td>
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
    tests() {
      var testClasses = {}
      this.$store.state.currentJobTests.forEach(
        testRun => {
          if (! testClasses.hasOwnProperty(testRun.testclass)) {
            testClasses[testRun.testclass] = {
              passed: 0, failed: 0, skipped: 0
            }
          }
          if (testRun.result === 'passed') {
            testClasses[testRun.testclass].passed = 1
          } else if (testRun.result === 'failed') {
            testClasses[testRun.testclass].passed = 1
          }
        }
      )
      return testClasses
    }
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
