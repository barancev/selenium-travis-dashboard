<template>
  <div id="sidebar2" class="sidebar">
    <h2>Jobs</h2>
    <ul id="sidebar-jobs">
      <li v-for="job in jobs" :key="job.id" :class="[{ active: job.id === currentJob.id }, job.state]" @click="selectJob(job.id)" :title="job.message+' by '+job.author_name+' in '+job.branch"><state-icon :status="job.state"></state-icon>{{job.number}}</li>
    </ul>
  </div>
</template>

<script>
import StateIcon from '../components/StateIcon.vue'

export default {
  name: 'JobsSidebar',
  created: function() {
    //this.$store.commit('reloadBuilds')
  },
  computed: {
    jobs() { return this.$store.state.currentBuildJobs },
    currentJob() { return this.$store.state.currentJob || {} },
  },
  components: {
    StateIcon
  },
  methods: {
    selectJob(id) {
      this.$router.push(`/job/${id}`)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sidebar2 {
  background-color: #f0f0f0;
}

#sidebar2 li.active {
  background-color: #ffffff;
}
</style>
