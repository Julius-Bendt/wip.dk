import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: "Home",
      },
    },
    {
      path: '/colors',
      name: 'colors',
      meta: {
        title: "Color scheme",
      },
      component: () => import('../views/ColorSchemeView.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      meta: {
        title: "Tools",
      },
      component: () => import('../views/ToolsView.vue')
    },
    {
      path: '/crypto',
      name: 'crypto',
      meta: {
        title: "Crypto",
      },
      component: () => import('../views/CryptoView.vue')
    }
  ]
})

const DEFAULT_TITLE = 'WIP';
router.afterEach((to, from) => {
  let title = DEFAULT_TITLE;

  if (to.meta.title != undefined) {
    title = "WIP | " + to.meta.title;
  }
  document.title = title;
});

export default router
