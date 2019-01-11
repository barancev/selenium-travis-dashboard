<template>
  <div class="icon">
    <i class="fab fa-github fa-fw"></i>
    <a :href="target.compare_url">{{target.message}}</a>, by {{target.author_name}} in {{target.branch.name}}
  </div>
</template>

<script>
export default {
  name: 'Commit',
  props: {
    target: Object,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
