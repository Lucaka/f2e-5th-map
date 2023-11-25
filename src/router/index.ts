import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from '@/Layouts/Home/HomeView.vue'

import HomeView from '@/views/Home/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'home.index',
          component: HomeView
        }
      ]
    }
  ]
})

export default router
