import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import ChatBox from '../views/ChatBox.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      redirect: '/chat/chatBox',
      children:[{
        name:'chatBox',
        path:'chatBox/:historyId?',
        component:ChatBox,
      },]
    },
    {
      path: '/subject',
      name: 'subject',
      component: () => import('../views/SubjectView.vue'),
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('../views/GraphView.vue'),
    },
    {
      path:"/",
      redirect: '/chat/chatBox'
    }
  ],
})

export default router
