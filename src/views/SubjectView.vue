<template>
  <div class="subject-container">
    <header>
      <div>栏目列表</div>
      <button @click="subproblem_list_collasped = !subproblem_list_collasped">
        子问题
      </button>
    </header>

    <main>

      <div class="status"
        style="position: absolute; bottom: 0; left: 0; background-color: teal; color: white; width: 20%; height: 40%;">
        内容总高度<br /> {{ listContainer?.scrollHeight }} <br /><br />
        当前滚动位置 <br />{{ listContainer?.scrollTop }}<br /><br />
        可见区域高度<br />{{ listContainer?.clientHeight }}<br /><br />
      </div>
      <article ref="listContainer">
        <div class="article-container">
          <div class="card" v-for="article in pageData.articleList" :key="article.id">

            <img class="cover" :src="'https://cdn.caritas.pro/image/' + article.id + '.jpg'" alt="cover" />
            <div class="desp">
              <p class="title">{{ article.title }}</p>
              <p class="content">{{ article.content?.slice(0, 140) }}……</p>
              <div class="meta">
                <span>{{ article.author }}</span>
                <span>{{ article.lastUpdate }}</span>
              </div>
            </div>

          </div>
        </div>

      </article>
      <aside :style="{ display: subproblem_list_collasped ? 'none' : 'flex' }">
        子问题区域
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { SSPA_Relation, Subject, Article } from '@/types/subject'

const subproblem_list_collasped = ref(true)
const pageData = ref({
  relationCount: 0,
  pageNum: 10,
  relationList: [] as SSPA_Relation[],
  subjectListResp: [] as Subject[],
  articleList: [] as Article[],
})
const listContainer = ref<HTMLElement | null>(null)
useInfiniteScroll(listContainer,
  async () => {

    console.log(listContainer.value?.scrollTop)
    pageData.value.pageNum += 1
    console.log(pageData.value.pageNum);
    console.log('rel size', pageData.value.relationList.length);
    console.log('article size', pageData.value.articleList.length);



    const relationList = await getRelationList(pageData.value.pageNum)
    pageData.value.relationList = relationList
    relationList.forEach(async (item: SSPA_Relation) => {
      pageData.value.articleList.push(await getArticle(item.articleId))
    })
    // 打印当前滚动位置
    console.log(listContainer.value?.scrollTop)

    console.log(pageData.value.pageNum);
    console.log('before rel size', pageData.value.relationList.length);
    console.log('article size', pageData.value.articleList.length);
  },
  {
    distance: 600,
    interval: 2000,
    direction: 'bottom',
    canLoadMore: () => true,
  },
)

// const onLoadMore = async () => {
//   pageData.value.pageNum += 1
//   const relationList = await getRelationList(pageData.value.pageNum)
//   pageData.value.relationList = relationList
//   relationList.forEach(async (item: SSPA_Relation) => {
//     pageData.value.articleList.push(await getArticle(item.articleId))
//   })
// }

onMounted(async () => {

  pageData.value.relationCount = await getRelationCount();
  // const relationList = await getRelationList(pageData.value.pageNum)
  // pageData.value.relationList = relationList
  // relationList.forEach(async (item: SSPA_Relation) => {
  //   pageData.value.articleList.push(await getArticle(item.articleId))
  // })
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
  padding: 0 20px;
  height: 50px;
  background-color: tomato;
}

main {
  display: flex;
  flex: 1;
}

article {
  flex: 4;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  background-color: azure;
}

aside {
  flex: 2;
  background-color: beige;
}
</style>
