import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    user: null,
    courses: [],
    enrolledCourses: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setCourses(state, courses) {
      state.courses = courses;
    },
    enrollCourse(state, courseId) {
      if (!state.enrolledCourses.includes(courseId)) {
        state.enrolledCourses.push(courseId);
      }
    },
    logout(state) {
      state.user = null;
      state.enrolledCourses = [];
    }
  },
  actions: {
    fetchCourses({ commit }) {
      axios.get('/api/courses')
        .then(response => {
          commit('setCourses', response.data);
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
        });
    },
    register({ commit }, user) {
      axios.post('/api/register', user)
        .then(response => {
          commit('setUser', response.data);
        })
        .catch(error => {
          console.error('Error registering user:', error);
        });
    },
    login({ commit }, user) {
      axios.post('/api/login', user)
        .then(response => {
          commit('setUser', response.data);
        })
        .catch(error => {
          console.error('Error logging in:', error);
        });
    },
    enrollCourse({ commit }, courseId) {
      axios.post('/api/enroll', { courseId })
        .then(() => {
          commit('enrollCourse', courseId);
        })
        .catch(error => {
          console.error('Error enrolling in course:', error);
        });
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    availableCourses: state => state.courses.filter(course => !state.enrolledCourses.includes(course.id)),
    enrolledCourses: state => state.enrolledCourses.map(id => state.courses.find(course => course.id === id))
  }
})

export default store
