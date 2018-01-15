<template>
  <div class="container">
    <h1>Tasks</h1>
    <hr>
    <div class="card">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div class="row">
            <div class="col-xs-12 col-sm-6 row" v-if="showControls">
              <div class="col-xs-6 col-sm-6 control-right">
                Task
              </div>
              <div class="col-xs-6 col-sm-6">
                <button type="button" class="btn btn-outline-primary" v-on:click="addTask()">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 row" v-if="showControls">
              <div class="col-xs-6 col-sm-6 control-right">
                Start
              </div>
              <div class="col-xs-6 col-sm-6">
                <button type="button" class="btn btn-outline-primary" v-on:click="start()">
                  <i class="fa fa-hourglass-start"></i>
                </button>
              </div>
            </div>

            <div class="col-xs-12 col-sm-6" v-if="startedFromZero">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <p class="timer">{{ timeFromZeroFormatted}}</p>
                  <button type="button" class="btn btn-outline-primary control-float-left"
                    v-on:click="stop()">
                    <i class="fa fa-stop"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6" v-if="startedFromZero">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <input type="text" class="control-top input-border input-100" v-model="newTaskName"
                    placeholder="Task Name">
                  <button type="button" class="btn btn-outline-primary control-float-right"
                    v-on:click="saveTask()" :disabled="intervalId">
                    <i class="fa fa-plus"></i>
                  </button>
                  <button type="button" class="btn btn-outline-primary control-float-right margin-right"
                    v-on:click="cancel()">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-xs-12 col-sm-6" v-if="addingTask">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <div class="row">
                    <input type="number" maxlength="2" class="control-top input-border time-control"
                      v-model="newHours" placeholder="HH">
                    <input type="number" maxlength="2" class="control-top input-border time-control"
                      v-model="newMinutes" placeholder="MM">
                    <input type="number" maxlength="2" class="control-top input-border time-control"
                      v-model="newSeconds" placeholder="SS">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6" v-if="addingTask">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <input type="text" class="control-top input-border input-100" v-model="newTaskName"
                    placeholder="Task Name">
                  <button type="button" class="btn btn-outline-primary control-float-right"
                    v-on:click="saveNewTask()" :disabled="disableSaveNewTask">
                    <i class="fa fa-plus"></i>
                  </button>
                  <button type="button" class="btn btn-outline-primary control-float-right margin-right"
                    v-on:click="cancel()">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-xs-12 col-sm-6" v-if="continueTaskTime">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <p class="timer">{{ timeFromZeroFormatted}}</p>
                  <button type="button" class="btn btn-outline-primary control-float-left"
                    v-on:click="stop()">
                      <i class="fa fa-stop"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6" v-if="continueTaskTime">
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <input type="text" class="control-top input-border input-100" v-model="newTaskName"
                    placeholder="Task Name" disabled>
                  <button type="button" class="btn btn-outline-primary control-float-right"
                    v-on:click="saveTask()" :disabled="intervalId">
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
        <li class="list-group-item" v-bind:key="task.key" v-for="task in userTasks">
          <div class="row">
            <div class="col-xs-4 col-sm-6">
              <label>{{task.name}}</label>
            </div>
            <div class="col-xs-5 col-sm-4">
              <label>{{ formatCounter(task.time) }}</label>
            </div>
            <div class="col-xs-3 col-sm-2">
              <button type="button" class="btn btn-outline-primary" v-on:click="start(task)">
                <i class="fa fa-pencil"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'tasks',
  data() {
    return {
      intervalId: null,
      startedFromZero: false,
      addingTask: false,
      continueTaskTime: false,
      timeFromZeroFormatted: '00:00:00',
      counter: moment.duration(0, 'seconds'),
      totalTime: 0,
      newTaskName: null,
      userTasks: [],
      newHours: null,
      newMinutes: null,
      newSeconds: null,
      currentTaskKey: null
    };
  },
  beforeMount() {
    this.$firebaseRef
      .child(this.$store.state.uid)
      .child('tasks')
      .on('child_added', (snapshot) => {
        const currentSnap = snapshot.val();
        currentSnap.key = snapshot.key;

        this.userTasks.push(currentSnap);
        this.sortTasks();
      });

    this.$firebaseRef
      .child(this.$store.state.uid)
      .child('tasks')
      .on('child_changed', (snapshot) => {
        const updated = snapshot.val();
        updated.key = snapshot.key;
        this.userTasks = this.userTasks.map((item) => {
          if (item.key === updated.key) {
            item.date = updated.date;
            item.time = updated.time;
          }
          return item;
        });
        this.sortTasks();
      });
  },
  methods: {
    start(task) {
      this.cancel();

      if (task) {
        this.counter = this.counter.add(task.time, 'ms');
        this.continueTaskTime = true;
        this.newTaskName = task.name;
        this.currentTaskKey = task.key;
        this.formatCounter();
      } else {
        this.startedFromZero = true;
        this.counter = moment.duration(0, 'seconds');
      }

      this.intervalId = setInterval(() => {
        this.counter = this.counter.add(1000, 'ms');
        this.formatCounter();
      }, 1000);
    },
    stop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.counter = moment.duration(0, 'seconds');
    },
    async saveTask() {
      const tasksRef = this.$firebaseRef
        .child(this.$store.state.uid)
        .child('tasks');

      const date = moment().format('YYYY-MM-DD HH:mm:ss');

      const currentTaskKey = this.newTaskName || this.currentTaskKey;
      if (currentTaskKey) {
        await tasksRef.child(currentTaskKey).update({
          date,
          name: this.newTaskName,
          time: this.totalTime
        });
      } else {
        await tasksRef.push({
          date,
          name: '',
          time: this.totalTime
        });
      }

      this.cancel();
    },
    formatCounter(value) {
      let time;
      if (value) {
        time = moment.duration(0, 'seconds');
        time = time.add(value, 'ms');
      } else {
        time = this.counter;
      }
      const hours = time.hours();
      const minutes = time.minutes();
      const seconds = time.seconds();

      const hoursString = this.getTimeValue(hours);
      const minutesString = this.getTimeValue(minutes);
      const secondsString = this.getTimeValue(seconds);
      const formatted = `${hoursString}:${minutesString}:${secondsString}`;

      if (!value) {
        const { _milliseconds } = time;
        this.totalTime = _milliseconds;
        this.timeFromZeroFormatted = formatted;
      }

      return formatted;
    },
    getTimeValue(value) {
      if (value) {
        return value > 9 ? value : `0${value}`;
      }
      return '00';
    },
    addTask() {
      this.addingTask = true;
    },
    saveNewTask() {
      this.counter = moment.duration(0, 'seconds');
      this.counter.add(+this.newHours, 'h');
      this.counter.add(+this.newMinutes, 'm');
      this.counter.add(+this.newSeconds, 's');

      const { _milliseconds } = this.counter;
      this.totalTime = _milliseconds;

      this.saveTask();
    },
    sortTasks() {
      this.userTasks.sort((a, b) => {
        if (moment(a.date).isAfter(b.date)) {
          return -1;
        }
        if (moment(b.date).isAfter(a.date)) {
          return 1;
        }
        return 0;
      });

      this.$emit('setUserTasks', this.userTasks);
    },
    cancel() {
      this.stop();
      this.startedFromZero = false;
      this.addingTask = false;
      this.continueTaskTime = false;
      this.timeFromZeroFormatted = '00:00:00';
      this.totalTime = 0;
      this.newTaskName = null;
      this.newHours = null;
      this.newMinutes = null;
      this.newSeconds = null;
      this.currentTaskKey = null;
    }
  },
  computed: {
    showControls() {
      return (
        !this.startedFromZero && !this.addingTask && !this.continueTaskTime
      );
    },
    disableSaveNewTask() {
      return !(
        this.newHours &&
        this.newHours < 24 &&
        this.newMinutes &&
        this.newMinutes < 60 &&
        this.newSeconds &&
        this.newSeconds < 60
      );
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

.control-float-left {
  padding-top: 10px;
  float: left;
  margin-top: 10px;
}

.control-float-right {
  padding-top: 10px;
  float: right;
  margin-top: 10px;
}

.margin-right {
  margin-right: 10px;
}

.control-float-right-row {
  padding-top: 10px;
  float: right;
}

.control-left {
  padding-top: 10px;
  text-align: left;
}

.time-control {
  width: 20%;
  margin: 0px 5px;
}

.input-border {
  border: 1px solid #0374d8;
  margin-top: 2px;
  border-radius: 5px;
}

.input-100 {
  width: 100%;
}

.timer {
  font-size: 20px;
  padding-top: 5px;
  float: left;
  width: 100%;
  margin: 0px;
}

.timer-row {
  font-size: 20px;
  padding-top: 5px;
  float: left;
  margin: 0px;
}
</style>
