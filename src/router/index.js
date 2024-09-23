import { createRouter, createWebHistory } from 'vue-router';
import Main from '../pages/Main.vue';
import AddProperty from '../pages/AddProperty.vue';
import SBInfo from '../pages/side/SimpleBuildingInfo.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/add',
      name: 'AddProperty',
      component: AddProperty,
    },
    {
      path: '/SB/1',
      name: 'SBInfo',
      component: Main,
    },
  ],
});

export default router;
