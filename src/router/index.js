import { createRouter, createWebHistory } from 'vue-router';
import Main from '../pages/Main.vue';
import AddProperty from '../pages/AddProperty.vue';
import SBInfo from '../pages/side/SimpleBuildingInfo.vue';
import SMS from '@/pages/auth/SMS.vue';
import Bookmark from '@/pages/auth/Bookmark.vue';
import Recent from '@/pages/auth/Recent.vue';
import ForSale from '@/pages/auth/ForSale.vue';
import Btn from '@/components/button/Btn.vue';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import RedirectUri from '@/pages/auth/RedirectUri.vue';

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
      path: '/SB/:complexId',
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
    {
      path: '/btn',
      name: 'Btn',
      component: Btn,
    },

    {
      path: '/SB/:complexId/:propId',
      name: 'PropertyDetails',
      component: PropertyDetails,
    },

    {
      path: '/redirect-uri',
      name: 'RedirectUri',
      component: RedirectUri,
    },
  ],
});

export default router;
