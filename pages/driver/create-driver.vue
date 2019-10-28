<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
                            <h3 class="text-xs-center">Add driver details</h3>
            <a-form
                class="v-card v-sheet theme--light pt-5 pr-5"
                :form="form"
                @submit="handleSubmit"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Full Name"
                        >
                        <a-input
                            v-decorator="[
                            'name',
                            {
                                rules: [{
                                    required: true, message: 'Please enter driver name!',
                                }]
                            }
                            ]"
                        />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="E-mail"
                        >
                        <a-input
                        
                            v-decorator="[
                            'email',
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
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Date of Birth"
                        >
                            <a-date-picker @change="setDateOfBirth" format="DD-MM-YYYY" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Phone Number"
                        >
                            <a-input
                                
                                v-decorator="[
                                'phone',
                                {
                                    rules: [{ required: true, message: 'Please input your phone number!' }],
                                }
                                ]"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Address"
                        >
                            <a-input
                                
                                v-decorator="[
                                'address',
                                {
                                    rules: [{
                                        required: true, message: 'Please enter driver address!',
                                    }]
                                }
                                ]"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Post Code"
                        >
                            <a-input
                                v-model="driver.address.postalCode"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Town"
                        >
                            <a-input
                                v-model="driver.address.town"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="County"
                        >
                            <a-input
                                v-model="driver.address.country"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Rate per trip"
                        >
                            <a-input
                
                                v-decorator="[
                                'ratePerTrip',
                                {
                                    rules: [{
                                        required: true, message: 'Please enter driver rate per trip!',
                                    }]
                                }
                                ]"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Joining Date"
                        >
                            <a-date-picker @change="setJoiningDate" format="DD-MM-YYYY"  />
                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Active"
                        >
                            <a-switch defaultChecked @change='setStatus'/>
                            
                        </a-form-item>     
                    </a-col>
                    <a-col :span="24">
                        <a-form-item v-bind="formItemLayout" class="ml-5">
                            <a-button
                                type="primary"
                                html-type="submit"
                                :loading="loading"
                            >
                                Save
                            </a-button>
                        </a-form-item>
                    </a-col>
                    
                </a-row>
                
                
                
            </a-form>
        </v-flex>       
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      driver: {
        name: "",
        email: "",
        dateOfBirth: "",
        contactNumber: "",
        address: {
          streetAddress: "",
          town: "",
          country: "",
          postalCode: ""
        },
        ratePerTrip: "",
        joinDate: "",
        status: "Active"
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    setDateOfBirth(date, dateString) {
      this.driver.dateOfBirth = dateString;
    },
    setJoiningDate(date, dateString) {
      this.driver.joinDate = dateString;
    },
    setStatus(status) {
      if (status) {
        return (this.driver.status = "Active");
      }
      this.driver.status = "Inactive";
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true;
          this.driver.name = values.name;
          this.driver.email = values.email;
          this.driver.contactNumber = values.phone;
          this.driver.address.streetAddress = values.address;
          this.driver.ratePerTrip = values.ratePerTrip;
          axios
            .post("/api/create-driver", { ...this.driver })
            .then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$message.success(res.data.message);
                this.$router.push("/driver/driver");
              } else {
                this.$message.warning(res.data.message);
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err);
            });
        }
      });
    }
  }
};
</script>