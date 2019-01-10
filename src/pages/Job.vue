<template>
  <div class="flex">
    <builds-sidebar></builds-sidebar>
    <jobs-sidebar></jobs-sidebar>
    <div id="content">
      <div id="metadata" v-if="job">
        <div id="commit-info">
          <commit :target="job"></commit>
        </div>
        <div id="build-info" v-if="build">
          <state-icon :status="build.state"></state-icon><span class="info">Build #{{build.number}}</span>
          <duration :start="build.started_at" :finish="build.finished_at"></duration>
          <datetime :value="build.started_at"></datetime>
        </div>
        <div id="job-info" v-if="job">
          <state-icon :status="job.state"></state-icon><span class="info">Job #{{job.number}}</span>
          <duration :start="job.started_at" :finish="job.finished_at"></duration>
          <os-icon :os="job.os"></os-icon>
          <language-icon :language="job.language"></language-icon>
          <environment :env="job.env"></environment>
        </div>        
      </div>
      <duration-chart v-if="chartData.length" label="Job" title="Job Duration History" :data="chartData" :current="id" route-to="/job"></duration-chart>
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
            <tr v-for="(value, name) in tests" :key="name" @click="selectTestClass(name)">
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
import Environment from '../components/Environment.vue'
import BuildsSidebar from '../components/BuildsSidebar.vue'
import JobsSidebar from '../components/JobsSidebar.vue'
import DurationChart from '../components/DurationChart.vue'

export default {
  name: 'Job',
  watch: {
    '$route' (to, from) {
      this.$store.commit('setCurrentJobTests', [])
      this.$store.commit('setCurrentJobHistory', [])
      this.$store.dispatch('setCurrentJob', { id: to.params.id, loadJobHistory: true })
    }
  },
  created: function() {
    this.$store.commit('setCurrentJobTests', [])
      this.$store.commit('setCurrentJobHistory', [])
    this.$store.dispatch('setCurrentJob', { id: this.id, loadJobHistory: true })
  },
  computed: {
    id() { return Number(this.$route.params.id) },
    build() { return this.$store.state.currentBuild },
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
    },
    chartData() {
      var data = this.$store.state.currentJobHistory.map(
        job => {
          return {
            id: job.id,
            number: job.number,
            state: job.state,
            duration: ((job.finished_at ? new Date(job.finished_at) : now) - new Date(job.started_at)) / 1000,
          }
        }
      )
      data.reverse()
      return data
    }
  },
  components: {
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, Environment, BuildsSidebar, JobsSidebar, DurationChart
  },
  methods: {
    selectTestClass(name) {
      this.$router.push(`/job/${this.id}/${name}`)
    }
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
