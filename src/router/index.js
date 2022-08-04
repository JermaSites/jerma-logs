import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Home",
      path: "/",
      component: () => import("../views/Home.vue"),
    },
    {
      name: "Latest",
      path: "/latest",
      component: () => import("../views/Latest.vue"),
    },
    {
      name: "Months",
      path: "/:year",
      component: () => import("../views/Months.vue"),
    },
    {
      name: "Messages",
      path: "/:year/:month",
      component: () => import("../views/Messages.vue"),
    },
  ],
});

export default router;
