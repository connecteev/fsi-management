<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <!-- mini statistic start -->
        <v-flex lg3 sm6 xs12>
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
        </v-flex>
        <!-- mini statistic  end --> 
        <v-flex lg12 sm12 xs12>
          <h4>Absent Today - {{ moment().format('LL') }}</h4>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="operation" slot-scope="text, record, index">
              <a-button type="primary" @click="showModal = !showModal, checkExistingShifts(record._id)"><a-icon type="edit" /></a-button>
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
                        <a-button type="primary" @click="alternateShifts(record._id, index)">Submit</a-button>
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
import EChart from "@/components/chart/echart";
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

const data = [];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

export default {
  layout: "dashboard",
  components: {
    VWidget,
    MiniStatistic,
    WeatherCard,
    PostSingleCard,
    PostListCard,
    ProfileCard,
    EChart,
    CircleStatistic,
    LinearStatistic
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      allDriver: [],
      loading: false,
      showModal: false,
      checkedShiftE: false,
      checkedShiftM: false,
      confirmLoading: false,
      existShiftM: false,
      existShiftE: false,
      alternateDriver: {
        driverId: "",
        attendanceDate: {
          date: "",
          shifts: {}
        }
      }
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
          this.allDriver = res.data.drivers;
          await this.checkTodayAttendedOrNot();
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
          await this.data.map(async (item, index) => {
            let isMatched = await _.find(res.data, function(driver) {
              return driver.attendance.driverId == item._id;
            });
            console.log(isMatched, index);
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
        });
    },
    async checkExistingShifts(driverId) {
      await axios
        .post("/api/get-todays-attendance", {
          currentDate: moment().format("YYYY/MM/DD")
        })
        .then(async res => {
          //console.log("Todays Attendance ", res.data);
          let isMatched = await _.find(res.data, function(driver) {
            return driver.attendance.driverId == driverId;
          });
          console.log(isMatched);
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
    }
  },
  created() {
    this.getAuthenticatedUser();
    this.getDrivers();
  }
};
</script>
