<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <!-- mini statistic start -->
        <!-- <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-facebook"
            title="100+"
            sub-title="Likes"
            color="indigo"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-google"
            title="150+"
            sub-title="Connections"
            color="red"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-twitter"
            title="200+"
            sub-title="Followers"
            color="light-blue"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-instagram"
            title="50+"
            sub-title="Shots"
            color="purple"
          >
          </mini-statistic>
        </v-flex> -->
        <!-- mini statistic  end --> 
        <v-flex lg12 sm12 xs12>
          <h4>Driver Absent Today - {{ moment().format('LL') }}</h4>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="operation" slot-scope="text, record, index">
              <a-button type="primary" @click="showModal = !showModal, checkExistingShifts(record._id, index, 'driver')"><a-icon type="edit" /></a-button>
              <a-modal
                title="Alternate Shifts"
                :width="1000"
                :visible="showModal"
                v-model="showModal"
              >
              <template slot="footer">
                <a-button key="back" type="primary" @click="handleCancel">Return</a-button>
              
              </template>
                <a-table :columns="columns" :dataSource="allDriver" @change="onChange" rowKey="_id" :loading="loading">
                  <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
                  <template slot="operation" slot-scope="text, record, index">
                    <div class='editable-row-operations'>
          
                        <a-row >
                          <a-col :span="16"><a-checkbox v-if="!existShiftM" @change="checkShifts" value="M">AM</a-checkbox> <a-checkbox v-if="!existShiftE" value="E" @change="checkShifts">PM</a-checkbox></a-col>
                        <a-button type="primary" @click="addAlternateWork(record._id, index)">Submit</a-button>
                        </a-row>
                        
                    </div> 
                    
                  </template> 
                </a-table>
                
              </a-modal>
            </template> 
          </a-table>
        </v-flex>  
        <v-flex lg12 sm12 xs12>
          <h4>PA Absent Today - {{ moment().format('LL') }}</h4>
          <a-table :columns="paColumns" :dataSource="paData" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="operation" slot-scope="text, record, index">
              <a-button type="primary" @click="showPaModal = !showPaModal, checkExistingShifts(record._id, index, 'pa')"><a-icon type="edit" /></a-button>
              <a-modal
                title="Alternate Shifts"
                :width="1000"
                :visible="showPaModal"
                v-model="showPaModal"
              >
              <template slot="footer">
                <a-button key="back" type="primary" @click="handleCancel">Return</a-button>
              
              </template>
                <a-table :columns="paColumns" :dataSource="allPa" @change="onChange" rowKey="_id" :loading="loading">
                  <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
                  <template slot="operation" slot-scope="text, record, index">
                    <div class='editable-row-operations'>
          
                        <a-row >
                          <a-col :span="16"><a-checkbox v-if="!existShiftM" @change="checkShifts" value="M">AM</a-checkbox> <a-checkbox v-if="!existShiftE" value="E" @change="checkShifts">PM</a-checkbox></a-col>
                        <a-button type="primary" @click="addAlternateWork(record._id, index)">Submit</a-button>
                        </a-row>
                        
                    </div> 
                    
                  </template> 
                </a-table>
                
              </a-modal>
            </template> 
          </a-table>
        </v-flex>  
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import API from "@/api";

import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import PostListCard from "@/components/widgets/card/PostListCard";
import ProfileCard from "@/components/widgets/card/ProfileCard";
import PostSingleCard from "@/components/widgets/card/PostSingleCard";
import WeatherCard from "@/components/widgets/card/WeatherCard";
import PlainTable from "@/components/widgets/list/PlainTable";
import PlainTableOrder from "@/components/widgets/list/PlainTableOrder";
import VWidget from "@/components/VWidget";
import Material from "vuetify/es5/util/colors";
import CircleStatistic from "@/components/widgets/statistic/CircleStatistic";
import LinearStatistic from "@/components/widgets/statistic/LinearStatistic";
import axios from "axios";
import moment from "moment";
let _ = require("lodash");
const columns = [
  {
    title: "Name",
    dataIndex: "driver.name",
    width: "20%",
    scopedSlots: { customRender: "name" },
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.driver.name.length - b.driver.name.length
  },
  {
    title: "Alternate",
    dataIndex: "operation",
    width: "20%",
    scopedSlots: { customRender: "operation" }
  }
];
const paColumns = [
  {
    title: "Name",
    dataIndex: "pa.name",
    width: "20%",
    scopedSlots: { customRender: "name" },
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.driver.name.length - b.driver.name.length
  },
  {
    title: "Alternate",
    dataIndex: "operation",
    width: "20%",
    scopedSlots: { customRender: "operation" }
  }
];
const data = [];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}
const paData = [];
export default {
  layout: "dashboard",
  components: {
    VWidget,
    MiniStatistic,
    WeatherCard,
    PostSingleCard,
    PostListCard,
    ProfileCard,

    CircleStatistic,
    LinearStatistic
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    this.cacheData = paData.map(item => ({ ...item }));
    return {
      data,
      columns,
      paColumns,
      paData,
      allDriver: [],
      allPa: [],
      loading: false,
      showModal: false,
      showPaModal: false,
      checkedShiftE: false,
      checkedShiftM: false,
      confirmLoading: false,
      existShiftM: false,
      existShiftE: false,
      isDriver: false,
      isPa: false,
      alternativeShifts: {
        alternativeWork: {
          date: "",
          shifts: {},
          userId: ""
        }
      },
      userIndex: ""
    };
  },
  computed: {},
  methods: {
    moment,
    onChange,
    handleCancel(e) {
      this.showModal = false;
    },
    checkShifts(e) {
      if (e.target.value == "M") {
        this.checkedShiftM = e.target.checked;
      } else {
        this.checkedShiftE = e.target.checked;
      }
    },
    addAlternateWork(id, index) {
      this.alternativeShifts.alternativeWork.date = moment().format(
        "YYYY/MM/DD"
      );
      this.alternativeShifts.alternativeWork.shifts.morning = this.checkedShiftM;
      this.alternativeShifts.alternativeWork.shifts.evening = this.checkedShiftE;
      axios
        .post("/api/create-alternative-shifts", {
          userId: id,
          alternativeShifts: this.alternativeShifts
        })
        .then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            this.alternativeShifts.alternativeWork.date = "";
            this.alternativeShifts.alternativeWork.shifts.morning = false;
            this.alternativeShifts.alternativeWork.shifts.evening = false;
            this.checkedShiftM = false;
            this.checkedShiftE = false;
            this.showModal = false;
            this.showPaModal = false;
            if (isDriver) {
              this.data.splice(this.userIndex, 1);
              this.isDriver = false;
            }
            if (isPa) {
              this.paData.splice(this.userIndex, 1);
              this.isPa = false;
            }
          }
        })
        .catch(e => {});
    },
    getAuthenticatedUser() {
      axios
        .get("/api/authenticated-user")
        .then(res => {
          if (res.data.user) {
            this.$store.dispatch("user/setUser", res.data);
          } else {
            this.$router.push("/login");
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    async getDrivers() {
      this.loading = true;
      axios.get("/api/get-drivers").then(async res => {
        if (res.data.success) {
          this.data = res.data.drivers;
          await this.checkTodayAttendedOrNot();
          await this.getAllAttendence();
          this.loading = false;
        }
      });
    },
    async getAllDrivers() {
      this.loading = true;
      axios.get("/api/get-drivers").then(async res => {
        if (res.data.success) {
          this.allDriver = await res.data.drivers;
          await this.getAllAttendence();
          this.loading = false;
        }
      });
    },
    async checkTodayAttendedOrNot() {
      await axios
        .post("/api/get-todays-attendance", {
          currentDate: moment().format("YYYY/MM/DD")
        })
        .then(async res => {
          //console.log("Todays Attendance ", res.data);
          // checking driver attendance
          await this.data.map(async (item, index) => {
            let isMatched = await _.find(res.data, function(driver) {
              return driver.attendance.userId == item._id;
            });
            if (isMatched) {
              isMatched.attendance.dates.map(item => {
                if (item.date == moment().format("YYYY/MM/DD")) {
                  if (
                    item.shifts.morning == true &&
                    item.shifts.evening == true
                  ) {
                    this.data.splice(index, 1);
                    this.checkTodayAttendedOrNot();
                  } else {
                    return false;
                  }
                }
              });
            }
          });
          // checking pa attendance
          await this.paData.map(async (item, index) => {
            let isMatched = await _.find(res.data, function(driver) {
              return driver.attendance.userId == item._id;
            });
            if (isMatched) {
              isMatched.attendance.dates.map(item => {
                if (item.date == moment().format("YYYY/MM/DD")) {
                  if (
                    item.shifts.morning == true &&
                    item.shifts.evening == true
                  ) {
                    this.paData.splice(index, 1);
                    this.checkTodayAttendedOrNot();
                  } else {
                    return false;
                  }
                }
              });
            }
          });
        });
    },
    async getAllAttendence() {
      axios.get("/api/get-attendances").then(async res => {
        await this.data.map(async (item, index) => {
          let isMatched = await _.find(res.data.attendances, function(
            attendance
          ) {
            attendance.attendance.alternativeShifts.map(async element => {
              if (
                element.alternativeWork.date == moment().format("YYYY/MM/DD") &&
                element.alternativeWork.userId == item._id
              ) {
                await removeMatchedUser(index, "driverData");
              }
            });
          });
        });
        await this.paData.map(async (item, index) => {
          let isMatched = await _.find(res.data.attendances, function(
            attendance
          ) {
            attendance.attendance.alternativeShifts.map(async element => {
              if (
                element.alternativeWork.date == moment().format("YYYY/MM/DD") &&
                element.alternativeWork.userId == item._id
              ) {
                await removeMatchedUser(index, "pa");
              }
            });
          });
        });
      });
      const removeMatchedUser = (index, userType) => {
        if (userType == "pa") {
          return this.paData.splice(index, 1);
        } else {
          return this.data.splice(index, 1);
        }
      };
    },
    async checkExistingShifts(userId, index, userType) {
      if (userType == "driver") {
        this.isDriver = true;
      } else {
        this.isPa = true;
      }

      this.userIndex = index;
      this.alternativeShifts.alternativeWork.userId = userId;
      await axios
        .post("/api/get-todays-attendance", {
          currentDate: moment().format("YYYY/MM/DD")
        })
        .then(async res => {
          //checking driver existing shifts
          let isMatched = await _.find(res.data, function(driver) {
            return driver.attendance.userId == userId;
          });

          if (isMatched) {
            isMatched.attendance.dates.map(item => {
              if (item.date == moment().format("YYYY/MM/DD")) {
                if (item.shifts.morning == true) {
                  this.existShiftM = true;
                } else if (item.shifts.evening == true) {
                  this.existShiftE = true;
                }
              }
            });
          } else {
            this.existShiftM = false;
            this.existShiftE = false;
          }
        });
    },
    async getPa() {
      this.loading = true;
      axios.get("/api/get-all-pa").then(async res => {
        if (res.data.success) {
          this.paData = await res.data.pas;
          await this.getAllAttendence();
          this.loading = false;
        }
      });
    },
    getAllPa() {
      this.loading = true;
      axios.get("/api/get-all-pa").then(res => {
        if (res.data.success) {
          this.allPa = res.data.pas;

          this.loading = false;
        }
      });
    }
  },
  created() {
    this.getAuthenticatedUser();
    this.getDrivers();
    this.getAllDrivers();
    this.getAllAttendence();
    this.getPa();
    this.getAllPa();
  }
};
</script>
