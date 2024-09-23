import { createRouter, createWebHistory } from 'vue-router';
import Map from '../pages/Map.vue';
import AddProperty from '../pages/AddProperty.vue';
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
            name: 'AddProperty',
            component: AddProperty,
        },
    ],
});

export default router;
