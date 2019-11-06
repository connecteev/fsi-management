<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <h4>Make Attendance For Today - {{ moment().format('LL') }}</h4>
          <a-table :columns="columns" :dataSource="sortUserAlphabeticaly" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="shifts" slot-scope="text, record, index">
              <div class='editable-row-operations'>
    
                  <a-row >
                    <a-col :span="24"><a-checkbox @change="checkShifts" value="M">AM</a-checkbox> <a-checkbox value="E" @change="checkShifts">PM</a-checkbox></a-col>
                  </a-row>
               
              </div> 
            </template> 
            <template slot="operation" slot-scope="text, record, index">
              <a-button type="primary" @click="addAttendance(record._id, index)">Submit</a-button>
            </template> 
          </a-table>
        </v-flex>       
      </v-layout>
    </v-container>
  </div>
</template>
<script>
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
    title: "Working Shift's",
    dataIndex: "shifts",
    width: "30%",
    scopedSlots: { customRender: "shifts" }
  },
  {
    title: "Make Attendance",
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
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      loading: false,
      checkedShiftE: false,
      checkedShiftM: false,
      confirmLoading: false,
      currentDate: moment().format("YYYY/MM/DD"),
      attendance: {
        userId: "",
        attendanceDate: {
          date: "",
          shifts: {}
        }
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  computed: {
    sortUserAlphabeticaly(){
      return _.sortBy(this.data, [function(o) { return o.driver.name; }]);
    }
  },
  methods: {
    moment,
    onChange,
    checkShifts(e) {
      if (e.target.value == "M") {
        this.checkedShiftM = e.target.checked;
      } else {
        this.checkedShiftE = e.target.checked;
      }
    },
    edit(id) {
      this.$router.push(`/driver/update-driver/${id}`);
    },
    onDelete(id) {
      axios
        .post("/api/delete-driver", {
          id
        })
        .then(res => {
          if (res.data.success) {
            this.getDrivers();
            this.$message.success(res.data.message);
          }
        });
    },
    addAttendance(id, index) {
      this.attendance.userId = id;
      this.attendance.attendanceDate.date = moment().format("YYYY/MM/DD");
      this.attendance.attendanceDate.shifts.morning = this.checkedShiftM;
      this.attendance.attendanceDate.shifts.evening = this.checkedShiftE;
      axios
        .post("/api/create-attendance", this.attendance)
        .then(res => {
          if (res.data.success) {
            this.data.splice(index, 1);
            this.$message.success(res.data.message);
            this.attendance.attendanceDate.date = "";
            this.attendance.attendanceDate.shifts.morning = false;
            this.attendance.attendanceDate.shifts.evening = false;
            this.checkedShiftM = false;
            this.checkedShiftE = false;
          }
        })
        .catch(e => {});
    },
    async checkTodayAttendedOrNot() {
      await axios
        .post("/api/get-todays-attendance", { currentDate: this.currentDate })
        .then(async res => {
          await this.data.map(async (item, index) => {
            let isMatched = await _.find(res.data, function(driver) {
              return driver.attendance.userId == item._id;
            });
            if (isMatched) {
              this.data.splice(index, 1);

              this.checkTodayAttendedOrNot();
            }
          });
        });
    },
    handleCancel(e) {
      this.showAddDocModal = false;
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
                await removeMatchedUser(index);
              }
            });
          });
        });
      });
      const removeMatchedUser = index => {
        return this.data.splice(index, 1);
      };
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
    }
  },
  created() {
    this.getDrivers();
    this.getAllAttendence();
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

/* tile uploaded pictures */
.upload-list-inline .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}
</style>