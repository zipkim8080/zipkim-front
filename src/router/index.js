import { createRouter, createWebHistory } from 'vue-router';
import Main from '../pages/Main.vue';
import AddProperty from '../pages/AddProperty.vue';
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
  ],
});

export default router;
