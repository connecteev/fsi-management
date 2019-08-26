<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12 >
            <h3 class="text-xs-center">Edit child details</h3>
            <a-form
                class="v-card v-sheet theme--light pt-5 pr-5"
                :form="form"
                @submit="handleSubmit"
                :loading="loading"
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
                        v-if="isChild"
                         >
                            <div v-if="child.dateOfBirth">
                                <a-date-picker :defaultValue="moment(child.dateOfBirth, 'YYYY-MM-DD')" format="YYYY-MM-DD"  @change="setDateOfBirth" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setDateOfBirth" />
                            </div>
                           
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
                                        required: true, message: 'Please enter child address!',
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
                        v-if="isChild"
                        >
                          <div v-if="child.homePickUpTime">
                                <a-time-picker :defaultValue="moment(child.homePickUpTime, 'h:mm a')" use12Hours format="h:mm a" @change="setHomePickTime" />
                            </div>
                            <div v-else>
                        
                                <a-time-picker use12Hours format="h:mm a" @change="setHomePickTime" />
                            </div>

                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="School Pick Time"
                        v-if="isChild"
                        >
                          <div v-if="child.schoolPickUpTime">
                                  <a-time-picker :defaultValue="moment(child.schoolPickUpTime, 'h:mm a')" use12Hours format="h:mm a" @change="setSchoolPickTime" />
                              </div>
                              <div v-else>
                                  <a-time-picker use12Hours format="h:mm a" @change="setSchoolPickTime" />
                              </div>
                            
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
                        v-if="isChild"
                        >
                            
                            <div v-if="child.joinDate">
                                <a-date-picker :defaultValue="moment(child.joinDate, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="setJoiningDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setJoiningDate" />
                            </div>
                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Leaving Date"
                        v-if="isChild"
                        >
                            
                            <div v-if="child.leaveDate">
                                <a-date-picker :defaultValue="moment(child.leaveDate, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="setLeavingDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setLeavingDate" />
                            </div>
                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Active"
                        v-if="isChild"
                        >
                          <a-switch :defaultChecked="defaultChecked" @change='setStatus'/> 
                        </a-form-item>     
                    </a-col>
                    <a-col :span="24">
                        <a-form-item v-bind="formItemLayout" class="ml-5">
                            <a-button
                                type="primary"
                                html-type="submit"
                                :loading="loading"
                            >
                                Update
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
import moment from "moment";
export default {
  data() {
    return {
      defaultChecked: false,
      isChild: false,
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
        schoolName: "",
        schoolAddress: "",
        homePickUpTime: "",
        schoolPickUpTime: "",
        landline: "",
        medicalHistory: "",
        joinDate: "",
        leaveDate: "",
        status: "Active"
      },
      userId: this.$route.params.id
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    moment,
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
    setLeavingDate(date, dateString) {
      this.child.leaveDate = dateString;
    },
    setStatus(status) {
      if (status) {
        return (this.child.status = "Active");
      }
      this.child.status = "Inactive";
    },
    getUserDetails() {
      this.loading = true;
      axios
        .post("/api/get-single-child", { id: this.userId })
        .then(res => {
          this.isChild = true;
          let childDetails = res.data.child;
          this.child = childDetails;
          if (this.isChild) {
            this.form.setFieldsValue({ name: childDetails.name });
            this.form.setFieldsValue({ email: childDetails.email });
            this.form.setFieldsValue({ phone: childDetails.contactNumber });
            this.form.setFieldsValue({
              landline: childDetails.landline
            });
            this.form.setFieldsValue({
              address: childDetails.address.streetAddress
            });
            this.form.setFieldsValue({
              schoolName: childDetails.schoolName
            });
            this.form.setFieldsValue({
              schoolAddress: childDetails.schoolAddress
            });
          }
          if (childDetails.status == "Active") {
            this.defaultChecked = true;
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
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
            .post("/api/update-child", { ...this.child, id: this.userId })
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
  },
  created() {
    this.getUserDetails();
  }
};
</script>