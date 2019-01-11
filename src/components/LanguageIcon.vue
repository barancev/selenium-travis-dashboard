<template>
  <span>
    <i v-if="language === 'java'" class="fab fa-java fa-fw"></i>
    <i v-if="language === 'python'" class="fab fa-python fa-fw"></i>
    <i v-if="language === 'ruby'" class="fas fa-gem fa-fw"></i>
    {{ language }}
  </span>
</template>

<script>
export default {
  name: 'LanguageIcon',
  props: {
    language: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
