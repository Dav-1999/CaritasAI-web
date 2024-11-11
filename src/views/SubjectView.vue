<template>
  <div class="subject-container">
    <header>
      <div class="tabLayout">
        <!-- 主题导航栏 -->
        <NavLayout class="subjectTabLayout" :items="pageData.subjectList.map((item: Subject) => item.name)"
          @nav-selected="handleSwitchSubject" />
        <!-- 子问题标签栏，使用 :key 强制刷新 -->
        <TabLayout v-if="waitRefreshComp" :key="pageData.subjectId" style="font-size: 14px;" class="subproblemTabLayout" :has-set-all="true"
          :tabs="pageData.subproblemList.map((item: SubProblem) => item.name)" @tab-selected="handleSwitchSubproblem"
          @select-all="handleGetSubProblemAll" :selected-index="-1" />
      </div>
    </header>

    <main>
      <article ref="listContainer">
        <div class="article-container">
          <!-- 文章卡片列表 -->
          <div class="card" v-for="article in pageData.articleList" :key="article.id"
            @click="handleArticleJump(article)">
            <img class="cover" :src="'https://cdn.caritas.pro/image/' + article.id + '.jpg'" alt="cover" />
            <div class="desp">
              <p class="title">#{{ article.title }}#</p>
              <!-- 渲染处理后的 Markdown 内容 -->
              <div class="content">{{ renderMarkdown(article.content?.slice(0, 140) + '……') }}</div>
              <div class="meta">
                <span>{{ article.author }}</span>
                <span>{{ article.lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 没有更多内容时的提示 -->
        <div class="empty" v-if="pageData.isLoadEnd">
          <br />
          ---总该有条底线吧---
          <br />
          <br />
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { SSPA_Relation, Subject, Article, SubProblem } from '@/types/subject';

// 页面数据状态管理
const pageData = ref({
  relationCount: 0, // 关系总数
  pageNum: 0,       // 当前页码
  pageSize: 5,      // 每页大小
  subjectId: -1,    // 当前主题ID
  subproblemId: -1, // 当前子问题ID
  isLoadEnd: false,     // 是否已加载完所有内容
  isLoading: false,     // 是否正在加载
  articleList: [] as Article[],        // 文章列表
  subjectList: [] as Subject[],        // 主题列表
  subproblemList: [] as SubProblem[],  // 子问题列表
  currentRequestId: 0,  // 当前请求的ID，用于防止脏读
});

const waitRefreshComp = ref(true); // 是否需要刷新组件
const listContainer = ref<HTMLElement | null>(null); // 列表容器引用


// 加载更多文章的方法
const loadMoreArticles = async () => {
  // 防止重复加载
  if (pageData.value.isLoading) {
    return;
  }
  pageData.value.isLoading = true;

  const { pageNum: pn, pageSize: ps, subjectId, subproblemId } = pageData.value;
  console.log('加载页码:', pn, '页面大小:', ps, '主题ID:', subjectId, '子问题ID:', subproblemId);

  try {
    // 获取关系列表
    const relationList = await getRelationList(pn, ps, subjectId, subproblemId);
    if (relationList.length === 0) {
      pageData.value.isLoadEnd = true; // 没有更多数据，设置加载结束
    } else {
      // 并行获取文章内容
      const articlePromises = relationList.map((item: SSPA_Relation) =>
        getArticle(item.articleId)
      );
      const articles = await Promise.all(articlePromises);
      pageData.value.articleList.push(...articles);
      pageData.value.pageNum++;
    }
  } catch (error) {
    console.error('加载文章出错:', error);
  } finally {
    pageData.value.isLoading = false; // 重置加载状态
  }
};
// 初始化无限滚动的方法
const { reset } = useInfiniteScroll(
  listContainer,
  loadMoreArticles,
  {
    distance: 800,
    interval: 200,
    direction: 'bottom',
    canLoadMore: () => !pageData.value.isLoadEnd && !pageData.value.isLoading,
  }
);


// 监听子问题ID的变化，重新初始化无限滚动
watch(() => pageData.value.subproblemId, () => {
  // 停止之前的无限滚动监听
  resetPageData();
  reset();
});

// 处理文章点击跳转
const handleArticleJump = (article: Article) => {
  window.open(`https://api.caritas.pro/article/${article.id}`, '_blank');
};

// 切换主题
const handleSwitchSubject = (index: number) => {
  console.log('switch before:', pageData.value.subjectId, pageData.value.subproblemId);

  pageData.value.subjectId = pageData.value.subjectList[index].id;
  pageData.value.subproblemList = pageData.value.subjectList[index].subProblemList;
  pageData.value.subproblemId = -1; // 重置子问题ID
  console.log('switch after:', pageData.value.subjectId, pageData.value.subproblemId);

  resetPageData(); // 重置分页数据
  loadMoreArticles();
  // 刷新子问题标签栏
  // refreshComp();
  // 滚动到顶部
  scrollToTop();
};

// 切换子问题
const handleSwitchSubproblem = (index: number) => {
  pageData.value.subproblemId = pageData.value.subproblemList[index].id;
  resetPageData(); // 重置分页数据
  // 滚动到顶部
  scrollToTop();
  // 不再调用 loadMoreArticles();
};

// 获取所有子问题的文章
const handleGetSubProblemAll = () => {
  pageData.value.subproblemId = -1;
  resetPageData(); // 重置分页数据
  // 滚动到顶部
  scrollToTop();
  loadMoreArticles();
};

// 刷新添加了waitRefreshComp的组件
// const refreshComp = () => {
//   waitRefreshComp.value = !waitRefreshComp.value;
//   setTimeout(() => {
//     waitRefreshComp.value = !waitRefreshComp.value;
//   }, 20);
// };

// 重置分页数据的方法
const resetPageData = () => {
  pageData.value.pageNum = 0;
  pageData.value.articleList = [];
  pageData.value.isLoadEnd = false;
  pageData.value.isLoading = false; // 重置加载状态
  pageData.value.currentRequestId = 0;
};

// 滚动到顶部的方法
const scrollToTop = () => {
  if (listContainer.value) {
    listContainer.value.scrollTop = 0;
  }
};

// 解析 Markdown 内容的方法（简单处理）
const renderMarkdown = (content: string) => {
  // 正则匹配 Markdown 内容中的图片为 [图片]
  return content.replace(/!\[.*?\]\(.*?\)/g, '[图片]')
    .replace(/\[.*?\]\(.*?\)/g, '') // 去除 Markdown 链接
    .replace(/#+\s/g, '') // 去除 Markdown 标题
    .replace(/\*\*.*?\*\*/g, ''); // 去除加粗
};

// 组件挂载时初始化数据
onMounted(async () => {
  // 并行获取关系总数和主题列表
  const [relationCount, subjectList] = await Promise.all([getRelationCount(), getSubjectList()]);
  pageData.value.relationCount = relationCount;
  pageData.value.subjectList = subjectList;
  pageData.value.subjectId = subjectList[0].id; // 默认选中第一个主题
  pageData.value.subproblemList = subjectList[0].subProblemList; // 初始化子问题列表
  pageData.value.subproblemId = -1; // 默认显示全部子问题
  resetPageData(); // 重置分页数据
  // 加载初始的文章列表
  loadMoreArticles();
});
</script>

<style scoped>
@import url('../styles/subject.css');

/* 保持原始样式 */

.subject-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 定义往下使用的变量 */
  --header-height: 128px;
  --content-width: 1024px;
  --hight-light-color: #F2AB5E;
  /* 覆盖顶层背景色 */
  background-color: #FEFBF8;

  /* 不同屏幕尺寸下修改变量 */
  @media (max-width: 768px) {
    --content-width: 320px;
  }
}

header {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  height: var(--header-height);
}

.tabLayout {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  >* {
    max-width: var(--content-width);
  }
}

main {
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  margin: 0 auto;
}

article {
  flex: 4;
  max-height: calc(100vh - var(--header-height));
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--hight-light-color);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
}

.toggle-btn {
  background-color: transparent;
  border: none;
}

/* 样式化解析后的 Markdown 内容 */
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 5;
  /* 显示行数 */
  -webkit-line-clamp: 5;
  /* 显示行数 */
  -webkit-box-orient: vertical;
}
</style>
