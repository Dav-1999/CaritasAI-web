<template>
  <div class="subject-container">
    <header>
      <TabLayout :tabs="pageData.subjectTextList" @tab-selected="hanldeSwitchSubject" />
      <button class="toggle-btn" @click="subproblem_list_collasped = !subproblem_list_collasped">
        <i class="bi bi-list-ul" style="margin-right: 10px;font-size: 20px;"></i>
      </button>
    </header>

    <main>
      <article ref="listContainer">
        <div class="article-container">
          <div class="card" v-for="article in pageData.articleList" :key="article.id"
            @click="handleArticleJump(article)">

            <img class="cover" :src="'https://cdn.caritas.pro/image/' + article.id + '.jpg'" alt="cover" />
            <div class="desp">
              <p class="title">#{{ article.title }}#</p>
              <p class="content">{{ article.content?.slice(0, 140) }}……</p>
              <div class="meta">
                <span>{{ article.author }}</span>
                <span>{{ article.lastUpdate }}</span>
              </div>
            </div>

          </div>
        </div>
        <div class="empty" v-if="pageData.isLoadEnd">
          <br />
          ---总该有条底线吧---
          <br />
          <br />
        </div>

      </article>
      <aside :style="{ display: subproblem_list_collasped ? 'none' : 'flex' }">
        <TabLayout class="subproblem-list" v-if="needRefreshComp" :is-vertical="true"
          :tabs="pageData.subproblemList.map(item => item.name + ' | ' + item.articleCount)" @tab-selected="hanldeSwitchSubproblem" />
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { SSPA_Relation, Subject, Article, SubProblem } from '@/types/subject'

const subproblem_list_collasped = ref(true)
const pageData = ref({
  relationCount: 0,
  pageNum: -1,
  pageSize: 4,
  subjectId: 1,
  subproblemId: 9132,
  subproblemIdx: 0,
  isLoadEnd: false,
  isCanLoadMore: false,
  relationList: [] as SSPA_Relation[],
  articleList: [] as Article[],
  subjectList: [] as Subject[],
  subjectTextList: [] as string[],
  subproblemList: [] as SubProblem[]
})

const needRefreshComp = ref(true)


const listContainer = ref<HTMLElement | null>(null)
const { reset } = useInfiniteScroll(listContainer,
  async () => {

    const { pageNum: pn, pageSize: ps, subjectId, subproblemId } = pageData.value

    const relationList = await getRelationList(pn, ps, subjectId, subproblemId)
    if (relationList.length === 0) {
      pageData.value.isLoadEnd = true
    }
    pageData.value.relationList = relationList
    relationList.forEach(async (item: SSPA_Relation) => {
      pageData.value.articleList.push(await getArticle(item.articleId))
    })

    pageData.value.pageNum += 1
  },
  {
    distance: 600,
    interval: 200,
    direction: 'bottom',
    canLoadMore: () => pageData.value.isCanLoadMore,
  },
)

const handleArticleJump = (article: Article) => {
  // open link with id in new tab in background
  window.open(`https://api.caritas.pro/article/${article.id}`, '_blank')
}

const hanldeSwitchSubject = (index: number) => {

  pageData.value.subjectId = pageData.value.subjectList[index].id;
  pageData.value.subproblemList = pageData.value.subjectList[index].subProblemList;
  pageData.value.subproblemId = pageData.value.subproblemList[0].id;
  pageData.value.pageNum = -1;
  pageData.value.articleList = [];
  pageData.value.isCanLoadMore = true;
  pageData.value.isLoadEnd = false;
  refreshComponent();
  reset();
}

const hanldeSwitchSubproblem = (index: number) => {
  pageData.value.subproblemId = pageData.value.subproblemList[index].id;
  pageData.value.pageNum = -1;
  pageData.value.articleList = [];
  pageData.value.isCanLoadMore = true;
  pageData.value.isLoadEnd = false;
  reset();
}

const refreshComponent = () => {
  needRefreshComp.value = false;
  setTimeout(() => {
    needRefreshComp.value = true;
  }, 0); // 使用短暂的延迟来确保重新渲染
};

// const loadSubproblem = async (subjectId: number) => {
//   pageData.value.subproblemList = await getSubProblemList(subjectId)
// }

onMounted(async () => {
  const [relationCount, subjectList] = await Promise.all([getRelationCount(), getSubjectList()])
  pageData.value.relationCount = relationCount
  pageData.value.subjectList = subjectList;
  pageData.value.subjectTextList = pageData.value.subjectList
    .map((item: Subject) => item.name)
    .filter((name): name is string => name !== null);
  pageData.value.subproblemList = pageData.value.subjectList[0].subProblemList;
  pageData.value.isCanLoadMore = true;
  reset();
})

</script>

<style scoped>
@import url('../styles/subject.css');

.subject-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

main {
  display: flex;
  flex: 1;
}

article {
  flex: 4;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background-color: azure;

  /* 隐藏滚动条 */
  /* &::-webkit-scrollbar {
    display: none;
  } */

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #008080;
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
}

aside {
  flex: 1;
  background-color: #DEEBE9;
}

.subproblem-list {
  width: 100%;
}

.toggle-btn {
  background-color: transparent;
  border: none;
  font-size: 20px;
  margin-right: 10px;
}
</style>
