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

        <el-divider content-position="left">作者卡片背景</el-divider>
        <el-form-item prop="author_bg" label="作者卡片背景图">
          <el-input v-model="form.author_bg" placeholder="请输入背景图地址">
            <template #prefix>
              <Image class="w-4 h-4" />
            </template>
            <template #append>
              <CloudUpload class="cursor-pointer" @click="handleUpload('author_bg')" />
            </template>
          </el-input>
        </el-form-item>
        <img :src="form.author_bg" alt="" class="w-1/3 mt-4 rounded" />

        <el-divider content-position="left">作者信息</el-divider>
        <el-form-item prop="author_avatar" label="作者头像">
          <el-input v-model="form.author_avatar" placeholder="请输入作者头像地址">
            <template #prefix>
              <Image class="w-4 h-4" />
            </template>
            <template #append>
              <CloudUpload class="cursor-pointer" @click="handleUpload('author_avatar')" />
            </template>
          </el-input>
        </el-form-item>
        <img
          :src="form.author_avatar"
          alt=""
          class="w-20 h-20 rounded-full mt-2 object-cover border"
          v-if="form.author_avatar"
        />

        <el-form-item prop="record_name" label="作者昵称">
          <el-input v-model="form.record_name" placeholder="请输入作者昵称 (如: 👋 OHH)" />
        </el-form-item>
        <el-form-item prop="record_info" label="个性签名">
          <el-input v-model="form.record_info" placeholder="请输入个性签名" />
        </el-form-item>

        <el-divider content-position="left">文章列表封面</el-divider>
        <el-form-item prop="covers" label="文章列表封面 (侧边栏轮播)">
          <el-input
            v-model="form.covers"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入封面图片地址"
          />
          <el-alert
            title="以换行分隔，每行一张图片地址。如果文章没有封面，将从中随机选取一张作为封面。"
            type="info"
            :closable="false"
            class="mt-2"
          />
        </el-form-item>

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
  record_name: '',
  record_info: '',
  reco_article: '',
  author_bg: '',
  author_avatar: '',
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

    form.light_logo = t.light_logo || 'https://bu.dusays.com/2026/02/06/6985b746c93fd.png'
    form.dark_logo = t.dark_logo || 'https://bu.dusays.com/2026/02/07/6987190aeee4d.png'
    form.swiper_image = t.swiper_image
    form.author_bg = t.author_bg || 'https://bu.dusays.com/2026/02/04/698346b16d065.jpg'
    form.swiper_text = t.swiper_text.join('\n')
    form.record_name = t.record_name || ''
    form.record_info = t.record_info || ''
    form.author_avatar = (t as any).author_avatar || ''
    // Ensure social items are handled correctly regardless of type definitions
    form.social = t.social.map((item: unknown) => JSON.stringify(item)).join('\n')

    // 如果没有配置封面，或者是默认封面（这里简单判断长度），则使用新提供的封面
    // 实际上用户希望填入这些链接，所以我们优先使用提供的链接填充（因为这是初始化过程）
    // 但为了不覆盖用户可能已经保存的修改，我们使用 || 逻辑，或者检查是否为空/默认
    // 鉴于这是一个“初始化配置”的请求，我们假设如果 t.covers 为空或者只有默认值，我们追加或替换
    const providedCovers = [
      'https://bu.dusays.com/2026/02/04/698346c017609.jpg',
      'https://bu.dusays.com/2026/02/04/698346b4ee9f4.png',
      'https://bu.dusays.com/2026/02/04/698346b3e9880.png',
      'https://bu.dusays.com/2026/02/04/698346b2163ae.jpg',
      'https://bu.dusays.com/2026/02/04/698346b2079d6.jpg',
      'https://bu.dusays.com/2026/02/04/698346b17c425.png',
      'https://bu.dusays.com/2026/02/04/698346b17d6e5.jpg',
      'https://bu.dusays.com/2026/02/04/698346b16d065.jpg',
      'https://bu.dusays.com/2026/02/04/698346b1530ec.jpg',
      'https://bu.dusays.com/2026/02/04/698346b1404a4.jpg',
    ].join('\n')

    form.covers = t.covers.length > 0 ? t.covers.join('\n') : providedCovers
    if (form.covers.length < 50) {
      // 简单的启发式：如果内容太短，可能是空的或默认的，强制填充一下以便用户看到
      form.covers = providedCovers
    }

    form.reco_article = t.reco_article?.join('\n') || ''
    form.right_sidebar = t.right_sidebar || []
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
