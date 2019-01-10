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
            <th>Test Class / Test Case</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Skipped</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
            <template v-for="(testClass, testClassName) in tests">
              <tr :class="{ passed: !testClass.failed, failed: testClass.failed }" :key="testClassName" @click="toggleTestClass(testClassName)">
                <td class="testclass-name">
                  <span v-show="!testClass.expanded"><i class="fas fa-caret-right"></i></span>
                  <span v-show="testClass.expanded"><i class="fas fa-caret-down"></i></span>
                  {{ testClassName }}
                </td>
                <td><span class="passed" v-if="testClass.passed">{{ testClass.passed }}</span></td>
                <td><span class="failed" v-if="testClass.failed">{{ testClass.failed }}</span></td>
                <td><span class="skipped" v-if="testClass.skipped">{{ testClass.skipped }}</span></td>
                <td>{{ testClass.passed + testClass.failed + testClass.skipped }}</td>
              </tr>
              <template v-for="testcase in testClass.testcases">
                <tr :class="testcase.result" v-show="testClass.expanded" :key="testcase.testcase" @click="selectTestCase(testcase)">
                  <td class="testcase-name">{{ testcase.testcase }}</td>
                  <td colspan="4">{{ testcase.exception }}</td>
                </tr>
              </template>
            </template>
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
    tests() { return this.$store.state.currentJobTests },
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
  },
  components: {
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, Environment, BuildsSidebar, JobsSidebar, DurationChart
  },
  methods: {
    toggleTestClass(name) {
      this.$store.commit('toggleTestClass', name)
    },
    selectTestCase(testcase) {
      this.$router.push(`/job/${this.id}/${testcase.testclass}/${testcase.testcase}`)
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

td.testcase-name {
  padding-left: 30px;  
}
</style>
