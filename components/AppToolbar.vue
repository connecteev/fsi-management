<template>
  <v-toolbar
    color="primary"
    fixed
    dark
    app
  >
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="toggleDrawer()"></v-toolbar-side-icon>
    </v-toolbar-title>
    <!-- <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
    >
    </v-text-field> -->
    <v-spacer></v-spacer>
   
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
   
    <v-menu offset-y origin="center center" :nudge-right="140" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator">
        <v-avatar size="30px">
          <img src="../static/avatar/man_4.jpg" alt="Michael Wang"/>
        </v-avatar>
      </v-btn>
      <v-list class="pa-0">
        <v-list-tile  @click="showChangePassModal()" >
          <v-list-tile-action >
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Change Password</v-list-tile-title>
          </v-list-tile-content>
          
        </v-list-tile>
      </v-list>
      <v-list class="pa-0">
        <v-list-tile  @click="logoutUser()" >
          <v-list-tile-action >
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
          
        </v-list-tile>
      </v-list>

      <a-modal
        title="Change Password"
        :visible="visible"
        :width="600"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
      >
      <a-form
      :form="form"
      >
        <a-form-item
          v-bind="formItemLayout"
          label="Current Password"
        >
          <a-input
            v-decorator="[
              'current_password',
              {
                rules: [{
                  required: true, message: 'Please input your current password!',
                }, {
                  validator: validateToNextPassword,
                }],
              }
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="New Password"
        >
          <a-input
            v-decorator="[
              'password',
              {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: validateToNextPassword,
                }],
              }
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="Confirm New Password"
        >
          <a-input
            v-decorator="[
              'confirm',
              {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: compareToFirstPassword,
                }],
              }
            ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    </v-menu>
  </v-toolbar>
</template>
<script>
import NotificationList from "@/components/widgets/list/NotificationList";
import Util from "@/util";
import axios from "axios";
export default {
  name: "app-toolbar",
  components: {
    NotificationList
  },
  data: () => ({
    visible: false,
    confirmLoading: false,
    confirmDirty: false,
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  }),
  computed: {
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav;
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    showChangePassModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.confirmLoading = true;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          axios
            .post("/api/change-password", {
              id: this.$store.state.user.authUser.id,
              user: this.$store.state.user.authUser.user,
              newPassword: values.password,
              currentPassword: values.current_password
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
      this.visible = false;
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    },
    handleFullScreen() {
      Util.toggleFullScreen();
    },
    goHome() {
      this.$router.push({ path: "/" });
    },
    logoutUser() {
      axios
        .get("/api/logout")
        .then(res => {
          if (res.data.success) {
            this.$router.push({ path: "/" });
          }
        })
        .catch(error => {
          this.$message.warning(error);
        });
    }
  }
};
</script>
