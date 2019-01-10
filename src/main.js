import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.config.productionTip = false

import faunadb, { query as q } from 'faunadb'

//const FAUNADB_SECRET = 'fnADEPApZiACBUEMtW3CmT_zSm5cfYPZRz-bDIz7'; // client
const FAUNADB_SECRET = 'fnADEPCDN2ACBQ-VPr30vN1znfF6UN6jq-CoAp74'; // server-readonly
const dbClient = new faunadb.Client({ secret: FAUNADB_SECRET });

const store = new Vuex.Store({
  state: {
    builds: [],
    currentBuild: null,
    currentBuildRef: null,
    currentBuildJobs: [],
    currentJob: null,
    currentJobTests: [],
    currentJobHistory: [],
  },
  mutations: {
    setBuilds(state, builds) {
      state.builds = builds
    },
    setCurrentBuild(state, build) {
      state.currentBuild = build
    },
    setCurrentBuildJobs(state, jobs) {
      state.currentBuildJobs = jobs
    },
    setCurrentJob(state, job) {
      state.currentJob = job
    },
    setCurrentJobTests(state, tests) {
      state.currentJobTests = tests
    },
    setCurrentJobHistory(state, history) {
      state.currentJobHistory = history
    },
  },
  actions: {
    reloadBuilds(context) {
      dbClient.query(
        q.Map(
          q.Paginate(q.Match(q.Index("all_travis_builds"))),
          q.Lambda("x", q.Get(q.Var("x")))
        )
      ).then(
        result => {
          var now = new Date()
          var builds = result.data.map(x => {
            var build = x.data
            build.duration = ((build.finished_at ? new Date(build.finished_at) : now) - new Date(build.started_at)) / 1000
            return build
          })
          builds.sort((a, b) => Number(b.number) - Number(a.number))
          context.commit('setBuilds', builds)
        }
      )
    },
    setCurrentBuild(context, id) {
      context.dispatch('reloadBuilds')
      dbClient.query(
        q.Get(q.Match(q.Index("travis_build_by_id"), Number(id)))
      ).then(
        result => {
          context.commit('setCurrentBuild', result.data)
          dbClient.query(
            q.Map(
              q.Paginate(q.Match(q.Index("travis_jobs_by_build_id"), result.data.id)),
              q.Lambda("x", q.Get(q.Var("x")))
            )
          ).then(
            result => {
              var now = new Date()
              var jobs = result.data.map(x => {
                var job = x.data
                job.duration = ((job.finished_at ? new Date(job.finished_at) : now) - new Date(job.started_at)) / 1000
                job.build_number = Number(job.number.split('.')[0])
                job.job_number = Number(job.number.split('.')[1])
                return job
              })
              jobs.sort((a, b) => a.job_number - b.job_number)
              context.commit('setCurrentBuildJobs', jobs)
            }
          )
        }
      )
    },
    setCurrentJob(context, params) {
      let job_id = Number(params.id)
      let loadJobHistory = params.loadJobHistory
      dbClient.query(
        q.Get(q.Match(q.Index("travis_job_by_id"), job_id))
      ).then(
        result => {
          var job = result.data
          context.commit('setCurrentJob', job)
          context.dispatch('setCurrentBuild', job.build)
          dbClient.query(
            q.Map(
              q.Paginate(q.Match(q.Index("test_runs_by_job_id"), job_id)),
              q.Lambda("x", q.Get(q.Var("x")))
            )
          ).then(
            result => {
              context.commit('setCurrentJobTests', result.data.map(x => x.data))
            }
          )
          if (loadJobHistory) {
            context.commit('setCurrentJobHistory', [])
            dbClient.query(
                q.Map(
                  q.Paginate(q.Match(q.Index("jobs_by_os_lang_env"), job.os, job.language, job.env[0])),
                  q.Lambda("x", q.Get(q.Var("x")))
                )
              ).then(
                result => {
                  var history = result.data.map(x => {
                    var job = x.data
                    job.duration = ((job.finished_at ? new Date(job.finished_at) : now) - new Date(job.started_at)) / 1000
                    job.build_number = Number(job.number.split('.')[0])
                    job.job_number = Number(job.number.split('.')[1])
                    return job
                  })
                  history.sort((a, b) => b.build_number - a.build_number)
                  context.commit('setCurrentJobHistory', history)
                }
              )
          }
        }
      )
    },
  }
})

import App from './App.vue'
import Builds from './pages/Builds.vue'
import Build from './pages/Build.vue'
import Job from './pages/Job.vue'
import TestClass from './pages/TestClass.vue'
import TestCase from './pages/TestCase.vue'

const routes = [
  { path: '/builds', alias: '/', component: Builds },
  { path: '/build/:id', component: Build },
  { path: '/job/:id', component: Job },
  { path: '/job/:id/:testclass', component: TestClass },
  { path: '/job/:id/:testclass/^testcase', component: TestCase },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
