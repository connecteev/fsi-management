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
                <v-form>
                  <v-text-field append-icon="person" name="login" label="Email" type="text"
                                v-model="model.email"></v-text-field>
                  <v-text-field append-icon="lock" name="password" label="Password" id="password" type="password"
                                v-model="model.password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
              </v-card-actions>
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
  data: () => ({
    loading: false,
    spinning: false,
    model: {
      email: "example@gmail.com",
      password: "password"
    }
  }),

  methods: {
    login() {
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
