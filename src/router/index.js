import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
import Layout from "@/layout/index";

const Login = () => import("@/views/login/Login");
const Index = () => import("@/views/home/Index");
const Monitoring = () => import("@/views/monitoring/Monitoring");
const Control = () => import("@/views/control/Control");
const Analyse = () => import("@/views/analyse/Analyse");

export const constantRoutes = [
  { path: "", redirect: "/home" },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    redirect: "/index",
    component: Layout,
    children: [
      { path: "/index", name: "Index", component: Index },
      { path: "/monitoring", name: "Monitoring", component: Monitoring },
      { path: "/control", name: "Control", component: Control },
      { path: "/analyse", name: "Analyse", component: Analyse },
    ],
  },
];

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});