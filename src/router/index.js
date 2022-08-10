import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Home",
      path: "/",
      component: () => import("../views/Home.vue"),
      meta: {
        breadcrumb: [
          {
            label: "Home",
          },
        ],
      },
    },
    {
      name: "Latest",
      path: "/Latest",
      component: () => import("../views/Latest.vue"),
      meta: {
        breadcrumb: [
          {
            label: "Home",
            to: { name: "Home" },
          },
          {
            label: "Latest",
          },
        ],
      },
    },
    {
      name: "Months",
      path: "/:year",
      component: () => import("../views/Months.vue"),
      meta: {
        breadcrumb(route) {
          const year = route.params.year;
          return [{ label: "Home", to: { name: "Home" } }, { label: year }];
        },
      },
    },
    {
      name: "Messages",
      path: "/:year/:month",
      component: () => import("../views/Messages.vue"),
      meta: {
        breadcrumb(route) {
          const year = route.params.year;
          const month = route.params.month;
          return [
            { label: "Home", to: { name: "Home" } },
            { label: year, to: { name: "Months" } },
            { label: month },
          ];
        },
      },
    },
  ],
});

export default router;
