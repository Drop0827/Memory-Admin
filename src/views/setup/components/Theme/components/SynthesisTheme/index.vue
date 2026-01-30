<template>
  <div>
    <h2 class="text-xl pb-4 pl-10 pt-4 md:pt-0">综合配置</h2>
    <div class="w-full lg:w-[500px] md:ml-10">
      <el-form
        ref="formRef"
        :model="form"
        layout="vertical"
        label-position="top"
        size="large"
        v-loading="loading"
      >
        <el-divider content-position="left">亮色主题 Logo</el-divider>
        <el-form-item prop="light_logo" label="亮色主题 Logo">
          <el-input v-model="form.light_logo" placeholder="请输入亮色Logo地址">
            <template #prefix>
              <Image class="w-4 h-4" />
            </template>
            <template #append>
              <CloudUpload class="cursor-pointer" @click="handleUpload('light_logo')" />
            </template>
          </el-input>
        </el-form-item>
        <img :src="form.light_logo" alt="" class="w-1/3 mt-4 rounded" />

        <el-divider content-position="left">暗色主题 Logo</el-divider>
        <el-form-item prop="dark_logo" label="暗色主题 Logo">
          <el-input v-model="form.dark_logo" placeholder="请输入暗色Logo地址">
            <template #prefix>
              <Image class="w-4 h-4" />
            </template>
            <template #append>
              <CloudUpload class="cursor-pointer" @click="handleUpload('dark_logo')" />
            </template>
          </el-input>
        </el-form-item>
        <img :src="form.dark_logo" alt="" class="w-1/3 mt-4 rounded" />

        <el-divider content-position="left">首页背景图</el-divider>
        <el-form-item prop="swiper_image" label="首页背景图">
          <el-input v-model="form.swiper_image" placeholder="请输入背景图地址">
            <template #prefix>
              <Image class="w-4 h-4" />
            </template>
            <template #append>
              <CloudUpload class="cursor-pointer" @click="handleUpload('swiper_image')" />
            </template>
          </el-input>
        </el-form-item>
        <img :src="form.swiper_image" alt="" class="w-1/3 mt-4 rounded" />

        <el-divider content-position="left">打字机文本</el-divider>
        <el-form-item prop="swiper_text" label="打字机文本">
          <el-input
            v-model="form.swiper_text"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入打字机文本"
          />
          <el-alert
            title="以换行分隔，每行表示一段文本"
            type="info"
            :closable="false"
            class="mt-2"
          />
        </el-form-item>

        <el-divider content-position="left">社交网站</el-divider>
        <el-form-item prop="social" label="社交网站">
          <el-input
            v-model="form.social"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入社交网站"
          />
          <el-alert
            title="请务必确保每一项格式正确，否则会导致网站无法访问"
            type="info"
            :closable="false"
            class="mt-2"
          />
        </el-form-item>

        <el-divider content-position="left">文章随机封面</el-divider>
        <el-form-item prop="covers" label="文章随机封面">
          <el-input
            v-model="form.covers"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入文章随机封面"
          />
          <el-alert
            title="以换行分隔，每行表示一段文本"
            type="info"
            :closable="false"
            class="mt-2"
          />
        </el-form-item>

        <el-divider content-position="left">作者推荐文章</el-divider>
        <el-form-item prop="reco_article" label="作者推荐文章">
          <el-input
            v-model="form.reco_article"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入作者推荐文章ID"
          />
          <el-alert
            title="以换行分隔，每行表示一段文本"
            type="info"
            :closable="false"
            class="mt-2"
          />
        </el-form-item>

        <el-divider content-position="left">侧边栏</el-divider>
        <el-checkbox-group v-model="form.right_sidebar">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <el-checkbox label="author" value="author">作者信息模块</el-checkbox>
            <el-checkbox label="runTime" value="runTime">站点时间模块</el-checkbox>
            <el-checkbox label="randomArticle" value="randomArticle">随机推荐模块</el-checkbox>
            <el-checkbox label="newComments" value="newComments">最新评论模块</el-checkbox>
            <el-checkbox label="hotArticle" value="hotArticle">作者推荐模块</el-checkbox>
            <el-checkbox label="study" value="study">装饰模块</el-checkbox>
          </div>
        </el-checkbox-group>

        <el-divider content-position="left">文章布局</el-divider>
        <div class="overflow-auto w-full">
          <div class="flex w-[650px]">
            <div
              v-for="item in ['classics', 'card', 'waterfall']"
              :key="item"
              @click="form.is_article_layout = item"
              class="flex flex-col items-center p-4 m-4 border-2 rounded cursor-pointer transition-colors"
              :class="
                form.is_article_layout === item
                  ? 'border-primary'
                  : 'border-gray-200 dark:border-strokedark'
              "
            >
              <p
                class="text-center mb-2"
                :class="form.is_article_layout === item ? 'text-primary' : ''"
              >
                {{ item === 'classics' ? '经典布局' : item === 'card' ? '卡片布局' : '瀑布流布局' }}
              </p>
              <img :src="getImg(item)" class="w-[200px] bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        <el-button
          type="primary"
          size="large"
          class="w-full mt-4"
          :loading="btnLoading"
          @click="onSubmit"
          >保存</el-button
        >
      </el-form>
    </div>

    <Material
      :open="isMaterialModalOpen"
      @close="isMaterialModalOpen = false"
      @select="handleMaterialSelect"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SynthesisTheme',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Image, CloudUpload } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import Material from '@/components/Material/index.vue'
import { getWebConfigDataAPI, editWebConfigDataAPI } from '@/api/config'
import type { Theme } from '@/types/app/config'
import cardImg from '../../image/card.png'
import classicsImg from '../../image/classics.png'
import waterfallImg from '../../image/waterfall.png'

const loading = ref(false)
const btnLoading = ref(false)
const isMaterialModalOpen = ref(false)
const currentUploadType = ref<keyof Theme | ''>('')
const theme = ref<Theme>({} as Theme)

const form = reactive({
  light_logo: '',
  dark_logo: '',
  swiper_image: '',
  swiper_text: '',
  social: '',
  covers: '',
  reco_article: '',
  right_sidebar: [] as string[],
  is_article_layout: '',
})

const getImg = (name: string) => {
  switch (name) {
    case 'card':
      return cardImg
    case 'classics':
      return classicsImg
    case 'waterfall':
      return waterfallImg
    default:
      return ''
  }
}

const getLayoutData = async () => {
  loading.value = true
  try {
    const { data } = await getWebConfigDataAPI<{ value: Theme }>('theme')
    theme.value = data.value
    const t = data.value

    form.light_logo = t.light_logo
    form.dark_logo = t.dark_logo
    form.swiper_image = t.swiper_image
    form.swiper_text = t.swiper_text.join('\n')
    // Ensure social items are handled correctly regardless of type definitions
    form.social = t.social.map((item: unknown) => JSON.stringify(item)).join('\n')
    form.covers = t.covers.join('\n')
    form.reco_article = t.reco_article.join('\n')
    form.right_sidebar = t.right_sidebar
    form.is_article_layout = t.is_article_layout
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  try {
    btnLoading.value = true
    const updatedTheme = {
      ...theme.value,
      ...form,
      social: form.social.split('\n').map((item: string) => JSON.parse(item)),
      swiper_text: form.swiper_text.split('\n'),
      covers: form.covers.split('\n'),
      reco_article: form.reco_article.split('\n'),
    }

    await editWebConfigDataAPI('theme', updatedTheme)
    ElMessage.success('🎉 修改主题成功')
    theme.value = updatedTheme
  } catch (e) {
    console.error(e)
  } finally {
    btnLoading.value = false
  }
}

const handleUpload = (type: string) => {
  currentUploadType.value = type as keyof Theme
  isMaterialModalOpen.value = true
}

const handleMaterialSelect = (urls: string[]) => {
  if (currentUploadType.value) {
    if (Object.keys(form).includes(currentUploadType.value)) {
      // @ts-expect-error key access
      form[currentUploadType.value] = urls[0]
    }
    // @ts-expect-error key access
    theme.value[currentUploadType.value] = urls[0]
  }
}

onMounted(() => {
  getLayoutData()
})
</script>
