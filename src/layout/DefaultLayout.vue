<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-whiten dark:bg-black-2">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Content Area -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Header -->
      <AppHeader />

      <!-- Main Content -->
      <main>
        <div class="mx-auto p-4">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
