<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12 >
            <h3 class="text-xs-center">Edit pa details</h3>
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
                                    required: true, message: 'Please enter pa name!',
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
                        v-if="ispa"
                         >
                            <div v-if="pa.dateOfBirth">
                                <a-date-picker :defaultValue="moment(pa.dateOfBirth, 'DD-MM-YYYY')" format="DD-MM-YYYY"  @change="setDateOfBirth" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setDateOfBirth" format="DD-MM-YYYY"/>
                            </div>
                           
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
                                        required: true, message: 'Please enter pa address!',
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
                                v-model="pa.address.postalCode"
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
                                v-model="pa.address.town"
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
                                v-model="pa.address.country"
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
                                        required: true, message: 'Please enter pa rate per trip!',
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
                        v-if="ispa"
                        >
                            
                            <div v-if="pa.joinDate">
                                <a-date-picker :defaultValue="moment(pa.joinDate, 'DD-MM-YYYY')" format="DD-MM-YYYY" @change="setJoiningDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setJoiningDate" format="DD-MM-YYYY"/>
                            </div>
                            
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Leaving Date"
                        v-if="ispa"
                        >
                            
                            <div v-if="pa.leaveDate">
                                <a-date-picker :defaultValue="moment(pa.leaveDate, 'DD-MM-YYYY')" format="DD-MM-YYYY" @change="setLeavingDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setLeavingDate" format="DD-MM-YYYY"/>
                            </div>
                            
                        </a-form-item>
                    </a-col>

                    <a-col :span="12" >
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Active"
                        v-if="ispa"
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
      ispa: false,
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
      pa: {
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
      this.pa.dateOfBirth = dateString;
    },
    setJoiningDate(date, dateString) {
      this.pa.joinDate = dateString;
    },
    setLeavingDate(date, dateString) {
      this.pa.leaveDate = dateString;
    },
    setStatus(status) {
      if (status) {
        return (this.pa.status = "Active");
      }
      this.pa.status = "Inactive";
    },
    getUserDetails() {
      this.loading = true;
      axios
        .post("/api/get-single-pa", { id: this.userId })
        .then(res => {
          this.ispa = true;
          let paDetails = res.data.pa;
          this.pa = paDetails;
          if (this.ispa) {
            this.form.setFieldsValue({ name: paDetails.name });
            this.form.setFieldsValue({ email: paDetails.email });
            this.form.setFieldsValue({ phone: paDetails.contactNumber });
            this.form.setFieldsValue({
              address: paDetails.address.streetAddress
            });
            this.form.setFieldsValue({
              ratePerTrip: paDetails.ratePerTrip
            });
          }
          if (paDetails.status == "Active") {
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
          this.pa.name = values.name;
          this.pa.email = values.email;
          this.pa.contactNumber = values.phone;
          this.pa.address.streetAddress = values.address;
          this.pa.ratePerTrip = values.ratePerTrip;
          axios
            .post("/api/update-pa", { ...this.pa, id: this.userId })
            .then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$message.success(res.data.message);
                this.$router.push("/pa/pa");
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