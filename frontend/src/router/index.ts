import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/modules/auth/layouts/Authenticated.vue"),
    children: [
      {
        path: "",
        name: "todos-dashboard",
        component: () => import("@/modules/todos/pages/TodosDashboard.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/auth/pages/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/modules/auth/pages/Register.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if ((to.path === "/login" || to.path === "/register") && token) {
    return next("/");
  }
  next();
});
