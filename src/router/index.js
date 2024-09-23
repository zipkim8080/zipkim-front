import { createRouter, createWebHistory } from 'vue-router';
import Main from '../pages/Main.vue';
import AddProperty from '../pages/AddProperty.vue';
import SMS from '@/pages/auth/SMS.vue';
import MyPage from '@/pages/auth/MyPage.vue';
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
      path: '/sms',
      name: 'SMS',
      component: SMS,
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
    },
  ],
});

export default router;
