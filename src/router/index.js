import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Message from '../views/Message'

Vue.use(Router)

// 配置路径与组件的对应关系
const routes = [{
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/message',
    component: Message
  }
]

export default new Router({
  mode: 'history', // 消除掉链接中的#号
  routes: routes // 这是简写，相当于 routes: routes
})