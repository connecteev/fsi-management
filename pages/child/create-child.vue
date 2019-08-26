<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
            <h3 class="text-xs-center">Add child details</h3>
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
                                    required: true, message: 'Please enter child name!',
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
                            <a-date-picker @change="setDateOfBirth" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Route Number"
                        >
                            <a-input
                                v-model="child.routeNumber"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Contact Number"
                        >
                            <a-input
                                
                                v-decorator="[
                                'phone',
                                {
                                    rules: [{ required: true, message: 'Please input your contact number!' }],
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
                        label="Landline"
                        >
                            <a-input
                
                                v-decorator="[
                                'landline',
                                {
                                    rules: [{
                                        required: true, message: 'Please enter your landline number!',
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
                        label="Postal Code"
                        >
                            <a-input
                                v-model="child.address.postalCode"
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
                                        required: true, message: 'Please enter address!',
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
                        label="Town"
                        >
                            <a-input
                                v-model="child.address.town"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Country"
                        >
                            <a-input
                                v-model="child.address.country"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="School Name"
                        >
                            <a-input
                                
                                v-decorator="[
                                'schoolName',
                                {
                                    rules: [{
                                        required: true, message: 'Please enter school name!',
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
                        label="School Address"
                        >
                            <a-input
                                
                                v-decorator="[
                                'schoolAddress',
                                {
                                    rules: [{
                                        required: true, message: 'Please enter school address!',
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
                        label="Home Pick Time"
                        >
                            <a-time-picker use12Hours format="h:mm a" @change="setHomePickTime" />
                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="School Pick Time"
                        >
                            <a-time-picker use12Hours format="h:mm a" @change="setSchoolPickTime" />
                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Medical History"
                        >
                          <a-textarea v-model="child.medicalHistory" placeholder="Enter your text here" :autosize="{ minRows: 2, maxRows: 10 }" />

                            
                        </a-form-item>
                    </a-col>
                    
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Joining Date"
                        >
                            <a-date-picker @change="setJoiningDate" />
                            
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
      child: {
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
      this.child.dateOfBirth = dateString;
    },
    setJoiningDate(date, dateString) {
      this.child.joinDate = dateString;
    },
    setHomePickTime(time, timeString) {
      this.child.homePickUpTime = timeString;
    },
    setSchoolPickTime(time, timeString) {
      this.child.schoolPickUpTime = timeString;
    },
    setStatus(status) {
      if (status) {
        return (this.child.status = "Active");
      }
      this.child.status = "Inactive";
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true;
          this.child.name = values.name;
          this.child.email = values.email;
          this.child.contactNumber = values.phone;
          this.child.address.streetAddress = values.address;
          this.child.landline = values.landline;
          this.child.schoolName = values.schoolName;
          this.child.schoolAddress = values.schoolAddress;

          axios
            .post("/api/create-child", { ...this.child })
            .then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$message.success(res.data.message);
                this.$router.push("/child/child");
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