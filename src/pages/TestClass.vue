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
        <legend>Test Class Duration History</legend>
        <div id="duration-history"></div>
      </fieldset>
      <div id="table-test-cases">
        <table>
          <thead>
          <tr>
            <th>Test Case</th>
            <th>Exception</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="test in tests" :key="test.testcase" @click="selectTestCase(test.testcase)">
              <td :class="test.result"><state-icon :status="test.result"></state-icon>{{ test.testcase }}</td>
              <td></td>
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
  name: 'TestClass',
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
    testclass() { return this.$route.params.testclass },
    job() { return this.$store.state.currentJob },
    tests() {
      return this.$store.state.currentJobTests.filter(
        testRun => testRun.testclass ===this.testclass
      )
    }
  },
  components: {
    Commit, StateIcon, Datetime, Duration, OsIcon, LanguageIcon, BuildsSidebar, JobsSidebar
  },
  methods: {
    selectTestCase(name) {
      this.$router.push(`/job/${this.id}/${this.testclass}/${name}`)
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
