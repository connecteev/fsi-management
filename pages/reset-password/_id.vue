  <template>
    <div>
      
      <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6 lg5>
            <v-card class="elevation-1 pa-2">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="../../static/fsi-logo.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 primary--text display-2">FSI</h1>
                  <h4 class="flex primary--text">Driver Management System</h4>
                  <h5 class="flex default--text">Reset your password</h5>
                </div>
                
                 <a-form
                :form="form"
                >        
                  <a-form-item
                    v-bind="formItemLayout"
                    label="Enter New Password"
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
                 <a-button class="mt-2 ml-4" size="large" type="primary" @click="resetPass()">Reset Password</a-button>
                </a-form>
                
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      resetToken: this.$route.params.id,
      isVerified: false,
      password: "",
      fullscreenLoading: false,
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
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    resetPass() {
      this.fullscreenLoading = true;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          axios
            .post("/api/check-reset-token", {
              resetToken: this.resetToken,
              newPassword: values.password
            })
            .then(response => {
              this.fullscreenLoading = false;
              if (response.data.validLink) {
                return;
              }
              if (response.data.resetPassword) {
                this.$message.success("Your password succuessfully changed.");
                this.$router.push({ path: "/" });
              } else {
                this.$message.error(
                  "Password reset token is invalid or has expired."
                );
                this.$router.push({ path: "/" });
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    checkResetLink() {
      axios
        .post("/api/check-reset-token", {
          resetToken: this.resetToken
        })
        .then(response => {
          if (response.data.resetToken) {
            return 0;
          }
          if (!response.data.resetToken && !response.data.success) {
            this.$message.error(response.data.message);
            this.$router.push({ path: "/" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.checkResetLink();
  }
};
</script>

<style scoped>
</style>