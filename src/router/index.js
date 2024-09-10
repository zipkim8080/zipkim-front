import { createRouter, createWebHistory } from 'vue-router';
import Map from '../pages/Map.vue';
import ProductRegi from '../pages/ProductRegi.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map,
    },
    {
      path: '/regi',
      name: 'regi',
      component: ProductRegi,
    },
  ],
});

export default router;
