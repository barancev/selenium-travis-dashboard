<template>
  <span>
    <i class="far fa-clock fa-fw"></i>{{duration}} sec
  </span>
</template>

<script>
export default {
  name: 'Duration',
  props: {
    start: String,
    finish: String
  },
  computed: {
    duration: function() {
      let startDate = Date.parse(this.start)
      let finishDate = this.finish ? Date.parse(this.finish) : new Date()
      return (finishDate - startDate) / 1000
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
