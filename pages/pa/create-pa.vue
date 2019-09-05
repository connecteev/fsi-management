<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
                            <h3 class="text-xs-center">Add pa details</h3>
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
                        >
                            <a-date-picker @change="setDateOfBirth" />
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
                        label="Postal Code"
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
                        label="Country"
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
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    setDateOfBirth(date, dateString) {
      this.pa.dateOfBirth = dateString;
    },
    setJoiningDate(date, dateString) {
      this.pa.joinDate = dateString;
    },
    setStatus(status) {
      if (status) {
        return (this.pa.status = "Active");
      }
      this.pa.status = "Inactive";
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
            .post("/api/create-pa", { ...this.pa })
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
  }
};
</script>