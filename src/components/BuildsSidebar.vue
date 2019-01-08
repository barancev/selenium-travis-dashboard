<template>
  <div id="sidebar1" class="sidebar">
    <h2>Builds</h2>
    <ul id="sidebar-builds">
      <li v-for="build in builds" :key="build.id" :class="[{ active: build.id === currentBuild.id }, build.state]" @click="selectBuild(build.id)" :title="build.message+' by '+build.author_name+' in '+build.branch"><state-icon :status="build.state"></state-icon>{{build.number}}</li>
    </ul>
  </div>
</template>

<script>
import StateIcon from '../components/StateIcon.vue'

export default {
  name: 'BuildsSidebar',
  created: function() {
    this.$store.commit('reloadBuilds')
  },
  computed: {
    builds() { return this.$store.state.builds },
    currentBuild() { return this.$store.state.currentBuild || {} },
  },
  components: {
    StateIcon
  },
  methods: {
    selectBuild(id) {
      this.$router.push(`/build/${id}`)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sidebar1 {
  background-color: #e8e8e8;
}

#sidebar1 li.active {
  background-color: #f0f0f0;
}
</style>
