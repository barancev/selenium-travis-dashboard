<template>
  <div class="flex">
    <builds-sidebar></builds-sidebar>
    <jobs-sidebar></jobs-sidebar>
    <div id="content">
      <div id="metadata" v-if="job">
        <div id="commit-info" v-if="build">
          <commit :target="build"></commit>
        </div>
        <div id="build-info" v-if="build">
          <span :class="build.state" class="build-number"><state-icon :target="build"></state-icon>Build #{{build.number}}</span>
          <duration :start="build.started_at" :finish="build.finished_at"></duration>
          <datetime :value="build.started_at"></datetime>
        </div>
        <div id="job-info" v-if="job">
          <span :class="job.state" class="job-number"><state-icon :target="job"></state-icon>Job #{{job.number}}</span>
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
            <th>Test Class / Test Case</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Skipped</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
            <template v-for="(testClass, testClassName) in testClasses">
              <tr :key="testClassName" @click="toggleTestClass(testClassName)">
                <td class="testclass-name" :class="{ passed: !testClass.failed, failed: testClass.failed }">
                  <span v-show="!testClass.expanded"><i class="fas fa-caret-right"></i></span>
                  <span v-show="testClass.expanded"><i class="fas fa-caret-down"></i></span>
                  <test-class :name="testClassName"></test-class>
                </td>
                <td><span class="passed" v-if="testClass.passed">{{ testClass.passed }}</span></td>
                <td><span class="failed" v-if="testClass.failed">{{ testClass.failed }}</span></td>
                <td><span class="skipped" v-if="testClass.skipped">{{ testClass.skipped }}</span></td>
                <td>{{ testClass.passed + testClass.failed + testClass.skipped }}</td>
              </tr>
              <template v-for="testcase in testClass.testcases">
                <tr :class="testcase.result" v-show="testClass.expanded" :key="testcase.testclass+'.'+testcase.testcase" @click="selectTestCase(testcase)">
                  <td class="testcase-name">{{ testcase.testcase }}</td>
                  <td colspan="4" class="can-wrap">{{ testcase.exception }} {{ testcase.message }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <test-results-chart v-if="showTestResults" :testcase="testcase" :current="job" :data="testResults" @close="showTestResults=false"></test-results-chart>
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
import TestResultsChart from '../components/TestResultsChart.vue'
import TestClass from '../components/TestClass.vue'

export default {
  name: 'Job',
  data: function() {
    return { showTestResults: false, testcase: null }
  },
  watch: {
    '$route' (to, from) {
      this.$store.commit('setCurrentJobTests', [])
      this.$store.commit('setCurrentJobHistory', [])
      this.$store.dispatch('setCurrentJob', { id: to.params.id, loadJobHistory: true })
    },
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
    testClasses() { return this.$store.state.currentJobTestClasses },
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
    },
    testResults() { return this.$store.state.currentTestResults }
  },
  components: {
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, Environment, BuildsSidebar, JobsSidebar, DurationChart, TestResultsChart, TestClass
  },
  methods: {
    toggleTestClass(name) {
      this.$store.commit('toggleTestClass', name)
    },
    selectTestCase(testcase) {
      this.showTestResults = true
      this.testcase = testcase
      this.$store.dispatch('loadTestResults', testcase)
    },
    refresh() {
      if (this.$store.state.currentJob) {
        let state = this.$store.state.currentJob.state
        if (state === 'pending' || state === 'started' || 'state' === 'running') {
          this.$store.dispatch('setCurrentJob', { id: this.id })
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

td.testcase-name {
  padding-left: 30px;  
}

#metadata span {
  padding-right: 5px;
}
</style>
