<template>
  <div>
    <el-segmented
      v-model="current"
      :options="['综合配置', '说说配置']"
      class="md:ml-10 mb-4"
      size="large"
    />

    <SynthesisTheme v-if="current === '综合配置'" />
    <RecordTheme v-if="current === '说说配置'" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ThemeConfig',
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import SynthesisTheme from './components/SynthesisTheme/index.vue'
import RecordTheme from './components/RecordTheme/index.vue'

const current = ref('综合配置')
</script>
