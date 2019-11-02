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
                <a-row :gutter="48">
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
                         <a-form-item
                        v-bind="formItemLayout"
                        label="Date of Birth"
                        >
                            <a-date-picker @change="setDateOfBirth" format="DD-MM-YYYY" />
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Dad Mobile"
                        >
                            <a-input
                                
                                v-decorator="[
                                'dadPhone',
                                {
                                    rules: [{ required: true, message: 'Please input dad mobile!' }],
                                }
                                ]"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Mum Mobile"
                        >
                            <a-input
                                
                                v-decorator="[
                                'momPhone',
                                {
                                    rules: [{ required: true, message: 'Please input mum mobile!' }],
                                }
                                ]"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Home Landline"
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
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Post Code"
                        >
                            <a-input
                                v-model="child.address.postalCode"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
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
                        <a-form-item
                        v-bind="formItemLayout"
                        label="County"
                        >
                            <a-input
                                v-model="child.address.country"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Joining Date"
                        >
                            <a-date-picker @change="setJoiningDate" format="DD-MM-YYYY" />
                            
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Assign Driver"
                        >
                        <a-select
                            showSearch
                            placeholder="Search or Select a driver"
                            optionFilterProp="children"
                            style="width: 200px"
                            @focus="handleFocus"
                            @blur="handleBlur"
                            @change="setAssignDriver"
                            :filterOption="filterOption"
                            
                        >
                            <a-select-option v-for="(item, index) in drivers"
                            :key="index" :value="item._id +' '+ item.driver.name">{{item.driver.name}}</a-select-option>
                            
                        </a-select>

                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Assign Pa"
                        >
                        <a-select
                            showSearch
                            placeholder="Search or Select a pa"
                            optionFilterProp="children"
                            style="width: 200px"
                            @focus="handleFocus"
                            @blur="handleBlur"
                            @change="setAssignPa"
                            :filterOption="filterOption"
                            
                        >
                            <a-select-option v-for="(item, index) in pas"
                            :key="index" :value="item._id +' '+ item.pa.name">{{item.pa.name}}</a-select-option>
                            
                        </a-select>

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
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Route Number"
                        >
                            <a-input
                                v-model="child.routeNumber"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Home Pick Time"
                        >
                            <a-time-picker use12Hours format="h:mm a" @change="setHomePickTime" />
                            
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="School Pick Time"
                        >
                            <a-time-picker use12Hours format="h:mm a" @change="setSchoolPickTime" />
                            
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="PA(Am) Pick Time"
                        >
                            <a-time-picker use12Hours format="h:mm a" @change="setPaAmPickTime" />
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="PA(Pm) Pick Time"
                        >
                            <a-time-picker use12Hours format="h:mm a" @change="setPaPmPickTime" />
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="Traveling Days">
                          <a-select mode="multiple" style="width: 100%" :tokenSeparators="[',']" @change="setTravelDays">
                            <a-select-option v-for="(item, index) in weekDays" :key="index" 
                              >{{item}}</a-select-option
                            >
                          </a-select>
                        </a-form-item>
                         <a-form-item
                        v-bind="formItemLayout"
                        label="Medical History"
                        >
                          <a-textarea v-model="child.medicalHistory" placeholder="Enter your text here" :autosize="{ minRows: 2, maxRows: 10 }" />

                            
                        </a-form-item>
                        
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Car Seat"
                        >
                            <a-input
                                v-model="child.carSeat"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Seating Position"
                        >
                            <a-input
                                v-model="child.seatingPosition"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="Music"
                        >
                            <a-input
                                v-model="child.music"
                                style="width: 100%"
                            >
                            </a-input>
                        </a-form-item>
                        <a-form-item
                        v-bind="formItemLayout"
                        label="PA Required"
                        >
                            <a-radio-group @change="setPaRequired" v-model="child.paRequired">
                              <a-radio value="Yes">Yes</a-radio>
                              <a-radio value="No">No</a-radio>
                            </a-radio-group>
                            
                        </a-form-item>   
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
        parentsNumber: "",
        address: {
          streetAddress: "",
          town: "",
          country: "",
          postalCode: ""
        },
        routeNumber: "",
        carSeat: "",
        joinDate: "",
        seatingPosition: "",
        music: "",
        travelDays: [],
        status: "Active",
        paRequired: "No",
        assignedDriver: {
          driverId: "",
          driverName: ""
        },
        assignedPa: {
          paId: "",
          paName: ""
        }
      },
      drivers: [],
      pas: [],
      weekDays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
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
    setPaAmPickTime(time, timeString) {
      this.child.paPickUpTimeAm = timeString;
    },
    setPaPmPickTime(time, timeString) {
      this.child.paPickUpTimePm = timeString;
    },
    setTravelDays(value) {
      this.child.travelDays = [];
      value.sort();
      value.map(item => {
        if (!this.child.travelDays.includes(this.weekDays[item])) {
          this.child.travelDays.push(this.weekDays[item]);
        }
      });
    },
    setStatus(status) {
      if (status) {
        return (this.child.status = "Active");
      }
      this.child.status = "Inactive";
    },
    setPaRequired(e) {
      this.child.paRequired = e.target.value;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true;
          this.child.name = values.name;
          this.child.email = values.email;
          this.child.contactNumber = values.dadPhone;
          this.child.parentsNumber = values.momPhone;
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
    },
    setAssignDriver(value) {
      let driverId = value.substr(0, value.indexOf(" ")); // id
      let driverName = value.substr(value.indexOf(" ") + 1); // name
      this.child.assignedDriver.driverId = driverId;
      this.child.assignedDriver.driverName = driverName;
    },
    setAssignPa(value) {
      let paId = value.substr(0, value.indexOf(" ")); // id
      let paName = value.substr(value.indexOf(" ") + 1); // name
      this.child.assignedPa.paId = paId;
      this.child.assignedPa.paName = paName;
    },
    handleBlur() {
      console.log("blur");
    },
    handleFocus() {
      console.log("focus");
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    getAllDrivers() {
      axios.get("/api/get-drivers").then(res => {
        if (res.data.success) {
          this.drivers = res.data.drivers;
        }
      });
    },
    getAllPas() {
      axios.get("/api/get-all-pa").then(res => {
        if (res.data.success) {
          this.pas = res.data.pas;
        }
      });
    }
  },
  created() {
    this.getAllDrivers();
    this.getAllPas();
  }
};
</script>