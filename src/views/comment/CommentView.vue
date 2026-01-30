<script setup lang="ts">
import { reactive } from 'vue'
import type { Comment } from '@/types/app/comment'
import PageTitle from '@/components/PageTitle.vue'
import useComment from '@/composables/useComment'
import { Send, Trash2, Search } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { useWebStore } from '@/stores'

const {
  loading,
  initialLoading,
  btnLoading,
  list,
  comment,
  isCommentModalOpen,
  isReplyModalOpen,
  replyInfo,
  getCommentList,
  delCommentData,
  onHandleReply,
  openDetailModal,
  openReplyModal,
} = useComment()

const webStore = useWebStore()

// 筛选表单
const filterForm = reactive({
  title: '',
  content: '',
  createTime: null as [Date, Date] | null,
})

const handleSearch = () => {
  const query: FilterData = {
    key: filterForm.title,
    content: filterForm.content,
  }

  if (filterForm.createTime && filterForm.createTime.length === 2) {
    query.startDate = dayjs(filterForm.createTime[0]).valueOf().toString()
    query.endDate = dayjs(filterForm.createTime[1]).valueOf().toString()
  }

  getCommentList(query)
}

const formatTime = (time: string | number) => {
  return dayjs(+time).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
  <div>
    <PageTitle title="评论管理" />

    <!-- 骨架屏 -->
    <div
      v-if="initialLoading"
      class="mt-2 min-h-[calc(100vh-160px)] p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark"
    >
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 主要内容 -->
    <div v-else>
      <!-- 筛选区域 -->
      <div
        class="bg-white dark:bg-boxdark p-4 rounded-sm border border-stroke dark:border-strokedark mb-4"
      >
        <el-form :inline="true" :model="filterForm" class="flex flex-wrap items-center">
          <el-form-item label="" class="!mb-0 !mr-4">
            <el-input v-model="filterForm.title" placeholder="请输入标题关键词" clearable />
          </el-form-item>
          <el-form-item label="" class="!mb-0 !mr-4">
            <el-input v-model="filterForm.content" placeholder="请输入内容关键词" clearable />
          </el-form-item>
          <el-form-item label="" class="!mb-0 !mr-4">
            <el-date-picker
              v-model="filterForm.createTime"
              type="daterange"
              range-separator="To"
              start-placeholder="选择起始时间"
              end-placeholder="选择结束时间"
            />
          </el-form-item>
          <el-form-item class="!mb-0">
            <el-button type="primary" :icon="Search" @click="handleSearch">筛选</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
        <el-table
          :data="list"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{ background: '#f8f9fc', color: '#687383' }"
        >
          <el-table-column prop="id" label="ID" width="100" align="center" />
          <el-table-column prop="name" label="名称" width="150" align="center" />

          <el-table-column label="内容" min-width="300">
            <template #default="scope">
              <span
                class="hover:text-primary cursor-pointer line-clamp-2"
                @click="openDetailModal(scope.row)"
              >
                {{ scope.row.content }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="邮箱" width="180">
            <template #default="scope">
              {{ scope.row.email || '暂无邮箱' }}
            </template>
          </el-table-column>

          <el-table-column label="网站" width="200">
            <template #default="scope">
              <a
                v-if="scope.row.url"
                :href="scope.row.url"
                target="_blank"
                class="text-primary hover:underline truncate block max-w-full"
              >
                {{ scope.row.url }}
              </a>
              <span v-else>无网站</span>
            </template>
          </el-table-column>

          <el-table-column label="所属文章" width="230">
            <template #default="scope">
              <a
                v-if="scope.row.articleTitle"
                :href="`${webStore.web.url}/article/${scope.row.articleId}`"
                target="_blank"
                class="text-primary hover:underline"
              >
                {{ scope.row.articleTitle }}
              </a>
              <span v-else>该评论暂未绑定文章</span>
            </template>
          </el-table-column>

          <el-table-column
            label="评论时间"
            width="180"
            sortable
            :sort-method="(a: Comment, b: Comment) => +a.createTime - +b.createTime"
          >
            <template #default="scope">
              {{ formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="scope">
              <div class="flex justify-center gap-2">
                <el-button link type="primary" :icon="Send" @click="openReplyModal(scope.row)" />
                <el-button
                  link
                  type="danger"
                  :icon="Trash2"
                  @click="delCommentData(scope.row.id)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex justify-center p-4">
          <el-pagination
            layout="prev, pager, next"
            :total="list.length"
            :page-size="8"
            v-if="list.length > 8"
          />
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="isCommentModalOpen" title="评论详情" width="600px" align-center>
      <div class="space-y-4 text-base">
        <div class="grid grid-cols-[100px_1fr] gap-2">
          <span class="font-bold text-right text-gray-700 dark:text-gray-300">所属文章：</span>
          <span>{{ comment.articleTitle }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
          <span class="font-bold text-right text-gray-700 dark:text-gray-300">评论时间：</span>
          <span>{{ formatTime(comment.createTime) }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
          <span class="font-bold text-right text-gray-700 dark:text-gray-300">评论用户：</span>
          <span>{{ comment.name }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
          <span class="font-bold text-right text-gray-700 dark:text-gray-300">邮箱：</span>
          <span>{{ comment.email || '暂无邮箱' }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
          <span class="font-bold text-right text-gray-700 dark:text-gray-300">网站：</span>
          <span>
            <a
              v-if="comment.url"
              :href="comment.url"
              target="_blank"
              class="text-primary hover:underline"
            >
              {{ comment.url }}
            </a>
            <span v-else>无网站</span>
          </span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
          <span class="font-bold text-right text-gray-700 dark:text-gray-300">内容：</span>
          <span class="whitespace-pre-wrap">{{ comment.content }}</span>
        </div>
      </div>
      <template #footer>
        <el-button
          type="primary"
          class="w-full"
          :loading="btnLoading"
          @click="openReplyModal(comment)"
        >
          回复
        </el-button>
      </template>
    </el-dialog>

    <!-- 回复弹窗 -->
    <el-dialog v-model="isReplyModalOpen" title="回复评论" width="500px" align-center>
      <el-input v-model="replyInfo" type="textarea" :rows="5" placeholder="请输入回复内容" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isReplyModalOpen = false">取消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="onHandleReply"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
