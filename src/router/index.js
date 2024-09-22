import { createRouter, createWebHistory } from 'vue-router';
import Map from '../pages/Map.vue';
import AddProperty2 from '../pages/AddProperty2.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Map',
            component: Map,
        },
        {
            path: '/add',
            name: 'AddProperty2',
            component: AddProperty2,
        },
    ],
});

export default router;
