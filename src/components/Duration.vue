<template>
  <span>
    <i class="far fa-clock fa-fw"></i>{{duration}}
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
      let duration = Math.floor((finishDate - startDate) / 1000)
      let minutes = Math.floor(duration / 60)
      let seconds = duration % 60
      return (minutes > 0 ? minutes + ' min ' : '') + seconds + ' sec'
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
