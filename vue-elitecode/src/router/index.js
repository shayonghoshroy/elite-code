// create vue router
import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
        { path: '/register', component: () => import('../views/Register.vue') },
        { path: '/signin', component: () => import('../views/SignIn.vue') },
        { 
            path: '/journal', 
            component: () => import('../views/Journal.vue'),
            meta: { requiresAuth: true }
        },
        // problem routes
        { path: '/problem/:id', component: () => import('../views/Problem.vue') },
        
    ],
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(), 
            user => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
}

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if(await getCurrentUser()) {
         next();
        } else {
            console.log("You must be logged in to view this page.");
            next('/signin');
        }
    } else {
        next();
    }
});

export default router;
