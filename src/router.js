import Vue from 'vue'
import Router from 'vue-router'
import RegisterNameForm from './components/RegisterNameForm.vue'
import ChoiceRole from './components/ChoiceRole.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'registerNameForm',
      component: RegisterNameForm
    },
    {
      path: '/choiceRole',
      name: 'choiceRole',
      component: ChoiceRole,
      props: true
    }
  ]
})