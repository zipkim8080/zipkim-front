import { createRouter, createWebHistory } from 'vue-router';
import Main from '../pages/Main.vue';
import AddProperty from '../pages/AddProperty.vue';
import SBInfo from '../pages/side/SimpleBuildingInfo.vue';
import SMS from '@/pages/auth/SMS.vue';
import Bookmark from '@/pages/auth/Bookmark.vue';
import Recent from '@/pages/auth/Recent.vue';
import ForSale from '@/pages/auth/ForSale.vue';
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
    {
      path: '/sms',
      name: 'SMS',
      component: SMS,
    },
    {
      path: '/bookmark',
      name: 'Bookmark',
      component: Bookmark,
    },
    {
      path: '/recent',
      name: 'Recent',
      component: Recent,
    },
    {
      path: '/forsale',
      name: 'ForSale',
      component: ForSale,
    },
  ],
});

export default router;
