import Vue from 'vue'
import Router from 'vue-router'
import RegisterNameForm from './pages/RegisterNameForm.vue'
import ChoiceRole from './pages/ChoiceRole.vue'
import PlayingGame from './pages/PlayingGame.vue'

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
    },
    {
      path: '/playingGame',
      name: 'playingGame',
      component: PlayingGame,
    }
  ]
})