<template>
  <v-app id="login" class="primary">
    <v-content :spinning="spinning">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="../static/fsi-logo.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 primary--text display-2">FSI</h1>
                  <h4 class="flex primary--text">Driver Management System</h4>
                </div>
                <v-form v-model="valid">
                  <v-text-field append-icon="person" name="login" label="Email" type="text" v-validate="'required|email'"
                  data-vv-name="email"     
                  :error-messages="errors.collect('email')"        
                  v-model="model.email"
                  required ></v-text-field>
                  <v-text-field append-icon="lock" name="password" label="Password" id="password" type="password"
                  v-validate="'required'"
                  data-vv-name="password"     
                  :error-messages="errors.collect('password')"        
                  v-model="model.password"
                  required
                  ></v-text-field>
                </v-form>
                <a-button type="primary" @click="showForgotPassModal">Forgot Password</a-button>

              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
              </v-card-actions>
              
                <a-modal
                  title="Forgot Password"
                  :visible="visible"
                  @ok="handleOk"
                  okText="Submit"	
                  :confirmLoading="confirmLoading"
                  @cancel="handleCancel"
                >
                <a-form layout='vertical' :form="form">
                  <a-form-item label='Email' >
                    <a-input
                    append-icon="person"
                    placeholder="Please enter your email."
                      v-decorator="[
                        'forgot_pass_email',
                        {
                          rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                          }, {
                            required: true, message: 'Please input your E-mail!',
                          }]
                        }
                      ]"
                    />
                  </a-form-item>
                  
                  
                </a-form>

                </a-modal>
             
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const axios = require("axios");

export default {
  layout: "default",
  $_veeValidate: {
    validator: "new"
  },
  data: () => ({
    loading: false,
    spinning: false,
    visible: false,
    confirmLoading: false,
    valid: true,
    model: {
      email: "example@gmail.com",
      password: "password"
    }
  }),
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },

  methods: {
    showForgotPassModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          console.log("Received values of form: ", values);
          axios
            .post("/api/forgot-password", {
              email: values.forgot_pass_email
            })
            .then(res => {
              if (res.data.success) {
                this.confirmLoading = false;
                this.$message.success(res.data.message);
                this.visible = false;
              }
              if (!res.data.success) {
                this.$message.warning(res.data.message);
                this.confirmLoading = false;
              }
            })
            .catch(error => {
              this.$message.warning(error);
              this.confirmLoading = false;
            });
        }
      });
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    login() {
      this.$validator
        .validateAll()
        .then(res => {
          if (res) {
            this.loading = true;
            axios
              .post("/api/login", {
                email: this.model.email,
                password: this.model.password
              })
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$store.dispatch("user/setUser", res.data.user);
                  this.$message.success(res.data.message);
                  this.$router.push("/dashboard");
                } else {
                  this.$message.warning(res.data.message);
                }
              })
              .catch(error => {
                this.$message.error(error);
              });
          }
        })
        .catch(e => {
          return console.log(e);
        });
    },
    getAuthenticatedUser() {
      axios
        .get("/api/authenticated-user")
        .then(res => {
          if (res.data.user) {
            this.$store.dispatch("user/setUser", res.data);
            this.$router.push("/dashboard");
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  },
  created() {
    this.spining = true;
    this.getAuthenticatedUser();
  }
};
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
