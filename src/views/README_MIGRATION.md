# Migration Status

This directory contains the Vue 3 implementation of the pages from the original React project (`src/pages`).

## Page Descriptions & Migration Status

| Original Page (src/pages) | New View (src/views)          | Description                                              | Status         |
| ------------------------- | ----------------------------- | -------------------------------------------------------- | -------------- |
| `dashboard`               | `dashboard/DashboardView.vue` | Admin Dashboard with statistics and charts.              | ✅ Done        |
| `login`                   | `login/LoginView.vue`         | Login page with authentication.                          | ✅ Done        |
| `setup`                   | `setup/SetupView.vue`         | System configuration (User, Web, Theme, etc.).           | ✅ Done        |
| `article`                 | `article/ArticleList.vue`     | Article management list with search, delete, and export. | ✅ In Progress |
| `create`                  | `create/CreateArticle.vue`    | Markdown editor for creating/editing articles.           | ⏳ Pending     |
| `cate`                    | `cate/CateList.vue`           | Category management.                                     | ⏳ Pending     |
| `tag`                     | `tag/TagList.vue`             | Tag management.                                          | ⏳ Pending     |
| `comment`                 | `comment/CommentList.vue`     | Comment management.                                      | ⏳ Pending     |
| `web`                     | `web/WebList.vue`             | Friend links / External websites management.             | ⏳ Pending     |
| `assistant`               | `assistant/AssistantList.vue` | AI Assistant prompt/config management.                   | ⏳ Pending     |
| `record`                  | `record/RecordList.vue`       | "Shuos" (Short notes/Microblog) management.              | ⏳ Pending     |
| `create_record`           | `record/CreateRecord.vue`     | Create new "Shuo".                                       | ⏳ Pending     |
| `wall`                    | `wall/WallList.vue`           | Guestbook/Wall message management.                       | ⏳ Pending     |
| `file`                    | `file/FileList.vue`           | File/Media management.                                   | ⏳ Pending     |
| `footprint`               | `footprint/FootprintList.vue` | User footprint/activity tracking.                        | ⏳ Pending     |
| `swiper`                  | `swiper/SwiperList.vue`       | Homepage carousel/swiper management.                     | ⏳ Pending     |
| `storage`                 | `storage/StorageList.vue`     | Storage configuration (OSS, etc.).                       | ⏳ Pending     |
| `config`                  | `config/ProjectConfig.vue`    | Advanced project configuration.                          | ⏳ Pending     |
| `work`                    | `work/Workbench.vue`          | Admin workbench/todo list.                               | ⏳ Pending     |
| `draft`                   | `draft/DraftList.vue`         | Article drafts.                                          | ⏳ Pending     |
| `decycle`                 | `recycle/RecycleBin.vue`      | Article recycle bin.                                     | ⏳ Pending     |
| `iterative`               | `log/UpdateLog.vue`           | System update logs.                                      | ⏳ Pending     |
