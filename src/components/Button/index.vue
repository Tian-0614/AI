<!-- src/components/Button/index.vue -->
<template>
  <button class="my-button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MyButton'
};
</script>

<style scoped>
.my-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>