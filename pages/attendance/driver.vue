<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <h4>Attendance For {{ moment().format('LL') }}</h4>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="shifts" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                
                  <a-row >
                    <a-col :span="24"><a-checkbox @change="checkShirts" value="M">M</a-checkbox> <a-checkbox value="E" @change="checkShirts">E</a-checkbox></a-col>
                  </a-row>
               
              </div> 
            </template> 
            <template slot="operation" slot-scope="text, record, index">
              <a-button type="primary" @click="addAttendance(record._id)">Submit</a-button>
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
// for (let i = 1; i < 100; i++) {
//   data.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`
//   });
// }

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
      file: null,
      uploading: false,
      document: {
        expiryDate: "",
        redAlertDate: "",
        greenAlertDate: "",
        status: "Active",
        userId: "",
        userName: ""
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    moment,
    onChange,
    checkShirts(e) {
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

    addDriver() {
      this.$router.push("/driver/create-driver");
    },
    viewDocs(id) {
      this.$router.push(`/view-docs/${id}`);
    },
    addAttendance() {},
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.showAddDocModal = false;
    },
    getDrivers() {
      this.loading = true;
      axios.get("/api/get-drivers").then(res => {
        if (res.data.success) {
          this.data = res.data.drivers;
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.getDrivers();
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