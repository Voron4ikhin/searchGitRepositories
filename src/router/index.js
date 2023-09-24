import { createRouter, createWebHistory } from "vue-router";
import MainComponent from '/src/components/MainComponent.vue'

const routes = [
   {
        path: '/',
        name: 'MainComponent',
        component: MainComponent,
   },
]

const router = createRouter({
    history: createWebHistory(),

    routes,
})

export default router