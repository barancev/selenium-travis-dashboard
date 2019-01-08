<template>
  <span>
    <i class="far fa-clock"></i>{{duration}}
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
      let finishDate = Date.parse(this.finish)
      return (finishDate - startDate) / 1000
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
