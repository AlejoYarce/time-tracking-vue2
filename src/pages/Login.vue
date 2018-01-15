<template>
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<div class="login100-form validate-form">
					<span class="login100-form-logo">
						<i class="fa fa-hourglass-half"></i>
					</span>

					<span class="login100-form-title p-b-34 p-t-27">
						Time Tracking
					</span>

					<div class="container-login100-form-btn">
						<button class="login100-form-btn" v-on:click="login()">
              <i class="fa fa-twitter login-icon" aria-hidden="true"></i>
							Login
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import store from '@/store';

export default {
  name: 'login',
  data() {
    return {
      msg: ''
    };
  },
  methods: {
    async login() {
      await store.dispatch('LOGIN');
      if (store.state.uid) {
        this.$router.push({ name: 'Home' });
      }
    }
  }
};
</script>

<style scoped>
/* font */
@font-face {
  font-family: Poppins-Regular;
  src: url('../../static/fonts/poppins/Poppins-Regular.ttf');
}

@font-face {
  font-family: Poppins-Medium;
  src: url('../../static/fonts/poppins/Poppins-Medium.ttf');
}

@font-face {
  font-family: Poppins-Bold;
  src: url('../../static/fonts/poppins/Poppins-Bold.ttf');
}

@font-face {
  font-family: Poppins-SemiBold;
  src: url('../../static/fonts/poppins/Poppins-SemiBold.ttf');
}

/* login */
.login-icon {
  font-size: 25px;
  padding-right: 10px;
}

.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login100 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  z-index: 1;
}

.container-login100::before {
  content: '';
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
}

.wrap-login100 {
  width: 500px;
  border-radius: 10px;
  overflow: hidden;
  padding: 55px;

  background: #0275d8;
}

/* form */
.login100-form {
  width: 100%;
}

.login100-form-logo {
  font-size: 60px;
  color: #333333;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 auto;
}

.login100-form-title {
  font-family: Poppins-Medium;
  font-size: 30px;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;

  display: block;
}

/* input */
input {
  outline: none;
  border: none;
}

input::-webkit-input-placeholder {
  color: #fff;
}
input:-moz-placeholder {
  color: #fff;
}
input::-moz-placeholder {
  color: #fff;
}
input:-ms-input-placeholder {
  color: #fff;
}

.wrap-input100 {
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255, 255, 255, 0.24);
  margin-bottom: 30px;
}

.input100 {
  font-family: Poppins-Regular;
  font-size: 16px;
  color: #fff;
  line-height: 1.2;

  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px 0 38px;
}

.focus-input100 {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.focus-input100::before {
  content: '';
  display: block;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;

  background: #fff;
}

.focus-input100::after {
  font-family: Material-Design-Iconic-Font;
  font-size: 22px;
  color: #fff;

  content: attr(data-placeholder);
  display: block;
  width: 100%;
  position: absolute;
  top: 6px;
  left: 0px;
  padding-left: 5px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.input100:focus {
  padding-left: 5px;
}

.input100:focus + .focus-input100::after {
  top: -22px;
  font-size: 18px;
}

.input100:focus + .focus-input100::before {
  width: 100%;
}

.has-val.input100 + .focus-input100::after {
  top: -22px;
  font-size: 18px;
}

.has-val.input100 + .focus-input100::before {
  width: 100%;
}

.has-val.input100 {
  padding-left: 5px;
}

/* button */
.container-login100-form-btn {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.login100-form-btn {
  font-family: Poppins-Medium;
  font-size: 16px;
  color: #555555;
  line-height: 1.2;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 120px;
  height: 50px;
  border-radius: 25px;

  background: #0374d8;
  position: relative;
  z-index: 1;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login100-form-btn::before {
  content: '';
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: #fff;
  top: 0;
  left: 0;
  opacity: 1;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login100-form-btn:hover {
  color: #fff;
}

.login100-form-btn:hover:before {
  opacity: 0;
}

/* responsive */
@media (max-width: 576px) {
  .wrap-login100 {
    padding: 55px 15px;
  }
}
</style>
