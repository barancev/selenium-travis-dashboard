<template>
  <span>
    <span v-for="item in env" :key="item"><i class="fas fa-cogs"></i>{{ item }}</span>
  </span>
</template>

<script>
export default {
  name: 'Environment',
  props: {
    env: Array,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
