<template>
  <div id="build-info" v-if="build">
    <span :class="[build.state, { clickable: isClickable }]" @click="openBuild(build)">
      <state-icon :target="build"></state-icon>Build #{{build.number}}
    </span>
    <datetime :value="build.started_at"></datetime>
    <a class="external-link" title="Open this build in Travis" :href="'https://travis-ci.org/SeleniumHQ/selenium/builds/'+build.id" target="_new"><i class="fas fa-external-link-alt fa-fw"></i></a>
  </div>

</template>

<script>
import StateIcon from '../components/StateIcon.vue'
import Datetime from '../components/Datetime.vue'

export default {
  name: 'BuildInfo',
  props: {
    build: Object,
    clickable: String
  },
  components: {
    StateIcon, Datetime
  },
  computed: {
    isClickable() { return this.clickable === 'true' }
  },
  methods: {
    openBuild(target) {
      if (this.isClickable) {
        this.$router.push(`/build/${target.id}`)
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
