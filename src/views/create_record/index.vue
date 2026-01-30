<template>
  <div>
    <Title :value="id ? '编辑说说' : '发布说说'" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        label-position="top"
        size="large"
        class="max-w-[800px] mx-auto pt-10"
      >
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12 }"
            placeholder="请输入说说内容..."
          />
        </el-form-item>

        <el-form-item label="图片" prop="images">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(img, index) in imageList"
              :key="index"
              class="relative w-24 h-24 rounded border border-gray-200 overflow-hidden group"
            >
              <el-image :src="img" fit="cover" class="w-full h-full" />
              <div
                class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Trash2 class="w-5 h-5" @click="removeImage(Number(index))" />
              </div>
            </div>
            <div
              class="w-24 h-24 rounded border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors"
              @click="isMaterialModalOpen = true"
            >
              <Plus class="w-6 h-6" />
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" :loading="loading" @click="onSubmit">
            {{ id ? '保存修改' : '立即发布' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <Material
      :multiple="true"
      :open="isMaterialModalOpen"
      @close="isMaterialModalOpen = false"
      @select="handleMaterialSelect"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'CreateRecord',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Trash2 } from 'lucide-vue-next'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Title from '@/components/Title/index.vue'
import Material from '@/components/Material/index.vue'
import { addRecordDataAPI, editRecordDataAPI, getRecordDataAPI } from '@/api/record'
import { titleSty } from '@/styles/sty'
import type { Record } from '@/types/app/record'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.query.id as string)

const loading = ref(false)
const isMaterialModalOpen = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  content: '',
  images: '',
})

const imageList = computed(() => {
  try {
    return form.images ? JSON.parse(form.images) : []
  } catch {
    return []
  }
})

const rules = reactive<FormRules>({
  content: [{ required: true, message: '请输入说说内容', trigger: 'blur' }],
})

const getRecordData = async () => {
  if (!id.value) return
  try {
    const res = await getRecordDataAPI(+id.value)
    const data = res.data as unknown as Record
    form.content = data.content
    form.images = typeof data.images === 'string' ? data.images : JSON.stringify(data.images)
  } catch (e) {
    console.error(e)
  }
}

const handleMaterialSelect = (urls: string[]) => {
  const list = [...imageList.value, ...urls]
  form.images = JSON.stringify(list)
}

const removeImage = (index: number) => {
  const list = [...imageList.value]
  list.splice(index, 1)
  form.images = JSON.stringify(list)
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (id.value) {
          await editRecordDataAPI({ id: Number(id.value), ...form })
          ElMessage.success('🎉 修改成功')
        } else {
          await addRecordDataAPI({ ...form, createTime: new Date().getTime().toString() })
          ElMessage.success('🎉 发布成功')
        }
        router.push('/record')
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  getRecordData()
})
</script>
