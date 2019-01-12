<template>
  <div id="job-info" v-if="job">
    <span :class="[job.state, { clickable: isClickable }]" @click="openJob(job)">
      <state-icon :target="job"></state-icon>Job #{{job.number}}
    </span>
    <duration :start="job.started_at" :finish="job.finished_at"></duration>
    <os-icon :os="job.os"></os-icon>
    <language-icon :language="job.language"></language-icon>
    <environment :env="job.env"></environment>
    <a class="external-link" title="Open this job in Travis" :href="'https://travis-ci.org/SeleniumHQ/selenium/jobs/'+job.id" target="_new"><i class="fas fa-external-link-alt fa-fw"></i></a>
  </div>        
</template>

<script>
import StateIcon from '../components/StateIcon.vue'
import Duration from '../components/Duration.vue'
import Datetime from '../components/Datetime.vue'
import OsIcon from '../components/OsIcon.vue'
import LanguageIcon from '../components/LanguageIcon.vue'
import Environment from '../components/Environment.vue'

export default {
  name: 'JobInfo',
  props: {
    job: Object,
    isClickable: Boolean
  },
  components: {
    StateIcon, Duration, Datetime, OsIcon, LanguageIcon, Environment
  },
  methods: {
    openJob(target) {
      if (this.isClickable) {
        this.$router.push(`/job/${target.id}`)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clickable {
  cursor: pointer;
}

.external-link {
  margin-left: 10px;
}
</style>
