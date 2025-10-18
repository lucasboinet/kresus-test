import { createWebHistory, createRouter } from "vue-router";

import TodosDashboard from "@/modules/todos/pages/TodosDashboard.vue";
import Login from "@/modules/auth/pages/Login.vue";
import Register from "@/modules/auth/pages/Register.vue";
import AuthLayout from "@/modules/auth/layouts/Authenticated.vue";

const routes = [
  {
    path: "/",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "todos-dashboard",
        component: TodosDashboard,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  { path: "/register", name: "register", component: Register },
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
