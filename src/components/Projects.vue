<template>
  <div class="container">
    <h1>Projects</h1>
    <hr>
    <div class="card">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div class="row">
            <div class="col-xs-12 col-sm-6 offset-sm-3 row" v-if="!addingProject">
              <div class="col-xs-6 col-sm-6 control-right">
                Project
              </div>
              <div class="col-xs-6 col-sm-6">
                <button type="button" class="btn btn-outline-primary" v-on:click="addProject()">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>

            <div class="col-xs-12 col-sm-7" v-if="addingProject">
              <div class="row">
                <input type="text" class="control-top input-border project-control" v-model="newProjectName" placeholder="Project Name">
              </div>
            </div>
            <div class="col-xs-12 col-sm-5" v-if="addingProject">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <button type="button" class="btn btn-outline-primary control-float-right"
                    v-on:click="saveNewProject()" :disabled="!newProjectName">
                    <i class="fa fa-plus"></i>
                  </button>
                  <button type="button" class="btn btn-outline-primary control-float-right margin-right"
                    v-on:click="cancel()">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li class="list-group-item" v-bind:key="project.key" v-for="(project, index) in userProjects">
          <div class="row">
            <div class="col-xs-4 col-sm-6">
              <label>{{project.name}}</label>
            </div>
            <div class="col-xs-5 col-sm-4">
              <label>{{ formatCounter(project.time) }}</label>
            </div>
            <div class="col-xs-3 col-sm-2">
              <button type="button" class="btn btn-outline-primary" v-on:click="showTasks(project, index)">
                <i class="fa fa-list-alt"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <modal name="select-tasks" height="auto" :scrollable="true" @closed="onModalClosed">
      <div class="container modal-margin">
        <div class="card">
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-bind:key="task.key" v-for="task in userTasks" v-if="renderTaskList">
              <div class="row">
                <div class="col-xs-4 col-sm-6">
                  <label>{{task.name}}</label>
                </div>
                <div class="col-xs-5 col-sm-4">
                  <label>{{ formatCounter(task.time) }}</label>
                </div>
                <div class="col-xs-3 col-sm-2">
                  <button type="button" class="btn btn-outline-primary" v-on:click="add(task.key)" v-if="!isSelected(task.key)">
                    <i class="fa fa-check"></i>
                  </button>
                  <button type="button" class="btn btn-outline-primary" v-on:click="remove(task.key)" v-else>
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'projects',
  data() {
    return {
      userProjects: [],
      selectedProjectTasks: {},
      addingProject: false,
      newProjectName: null,
      currentProjectKey: null,
      currentProjectIndex: null,
      renderTaskList: false
    };
  },
  props: ['userTasks'],
  beforeMount() {
    this.$firebaseRef
      .child(this.$store.state.uid)
      .child('projects')
      .on('child_added', (snapshot) => {
        const currentSnap = snapshot.val();
        currentSnap.key = snapshot.key;
        this.userProjects.push(currentSnap);
      });
    this.$firebaseRef
      .child(this.$store.state.uid)
      .child('projects')
      .on('child_changed', (snapshot) => {
        const currentSnap = snapshot.val();
        this.userProjects = this.userProjects.map((item) => {
          if (item.key === snapshot.key) {
            item.time = currentSnap.time;
          }
          return item;
        });
      });
  },
  methods: {
    addProject() {
      this.addingProject = true;
    },
    async saveNewProject() {
      const projectsRef = this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projects');

      const date = moment().format('YYYY-MM-DD HH:mm:ss');
      await projectsRef.push({
        date,
        name: this.newProjectName,
        time: 0
      });

      this.cancel();
    },
    async showTasks(project, index) {
      this.currentProjectKey = project.key;
      await this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey)
        .once('value')
        .then((snapshot) => {
          this.selectedProjectTasks[snapshot.key] = snapshot.val() || {};
          this.currentProjectIndex = index;

          setTimeout(this.$modal.show('select-tasks'), 1000);
          this.renderTaskList = true;
        });

      this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey)
        .on('child_added', (snapshot) => {
          this.selectedProjectTasks[this.currentProjectKey][snapshot.key] = snapshot.val();
        });

      this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey)
        .on('child_removed', (snapshot) => {
          delete this.selectedProjectTasks[this.currentProjectKey][snapshot.key];
        });
    },
    formatCounter(value) {
      let time = moment.duration(0, 'seconds');
      time = time.add(value, 'ms');

      const hours = time.hours();
      const minutes = time.minutes();
      const seconds = time.seconds();

      const hoursString = this.getTimeValue(hours);
      const minutesString = this.getTimeValue(minutes);
      const secondsString = this.getTimeValue(seconds);
      const formatted = `${hoursString}:${minutesString}:${secondsString}`;

      return formatted;
    },
    getTimeValue(value) {
      if (value) {
        return value > 9 ? value : `0${value}`;
      }
      return '00';
    },
    async add(taskKey) {
      const projectRef = this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey);

      const data = {};
      data[taskKey] = true;
      this.renderTaskList = false;
      await projectRef.update(data);
      this.renderTaskList = true;

      this.saveTotalTime(this.calculateProjectTime());
    },
    async remove(taskKey) {
      const projectRef = this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey)
        .child(taskKey);

      this.renderTaskList = false;
      await projectRef.remove();
      this.renderTaskList = true;

      this.saveTotalTime(this.calculateProjectTime());
    },
    isSelected(taskKey) {
      const selectedProject = this.selectedProjectTasks[this.currentProjectKey];
      if (selectedProject && this.selectedProjectTasks) {
        return Object.keys(selectedProject).find(item => item === taskKey);
      }
      return false;
    },
    saveTotalTime(time) {
      this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projects')
        .child(this.currentProjectKey)
        .update({ time });
    },
    calculateProjectTime() {
      const timeArray =
        Object.keys(this.selectedProjectTasks[this.currentProjectKey]).map((item) => {
          let sum = 0;
          this.userTasks.forEach((task) => {
            if (task.key === item) {
              sum += task.time;
            }
          });
          return sum;
        });

      if (timeArray.length) {
        return timeArray.reduce(this.sumItems);
      }

      return 0;
    },
    sumItems(a, b) {
      return a + b;
    },
    onModalClosed() {
      this.renderTaskList = false;
      this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey)
        .off('child_added');
      this.$firebaseRef
        .child(this.$store.state.uid)
        .child('projectTasks')
        .child(this.currentProjectKey)
        .off('child_removed');
    },
    cancel() {
      this.addingProject = false;
      this.newProjectName = null;
      this.currentProjectKey = null;
      this.currentProjectIndex = null;
    }
  }
};
</script>

<style scoped>
h1 {
  color: #13117f;
  font-weight: normal;
}

ul {
  font-size: 14px;
  list-style-type: none;
  padding: 0;
  text-align: left;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.control-top {
  padding: 10px 0px 0px 10px;
}

.control-right {
  padding-top: 10px;
  text-align: right;
}

.control-right {
  padding-top: 10px;
  text-align: right;
}

.control-float-left {
  padding-top: 10px;
  float: left;
  margin-top: 10px;
}

.control-float-right {
  padding-top: 10px;
  float: right;
}

.margin-right {
  margin-right: 10px;
}

.input-border {
  border: 1px solid #0374d8;
  margin-top: 2px;
  border-radius: 5px;
}

.project-control {
  width: 100%;
}

.modal-margin {
  margin: 20px 0px;
}
</style>
