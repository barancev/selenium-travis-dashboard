<template>
  <span>
    <i class="far fa-calendar fa-fw"></i>{{value}}
  </span>
</template>

<script>
export default {
  name: 'Datetime',
  props: {
    value: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
