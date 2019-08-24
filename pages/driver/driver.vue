<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <v-btn class="ml-4" depressed right color="primary" @click="addDriver"><v-icon dark>add</v-icon> Add Driver</v-btn>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            <!-- <template v-for="col in ['name', 'email', 'phone', 'dateOfBirth', 'address', 'status']" :slot="col" slot-scope="text, record, index">               
              <div :key="col">
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>{{text}}</template>
              </div>
            </template> -->
            <template slot="operation" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                <a @click="() => edit(record._id)">Edit</a>
                 <a-divider type="vertical" />
                <a-popconfirm
                v-if="data.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record._id)">
                <a href="javascript:;">Delete</a>
              </a-popconfirm>
              </div>
              
            </template> 
          </a-table>
        </v-flex>       
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

const columns = [
  {
    title: "Name",
    dataIndex: "driver.name",
    width: "15%",
    scopedSlots: { customRender: "name" },

    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.driver.name.length - b.driver.name.length
  },
  {
    title: "Email",
    dataIndex: "driver.email",
    width: "15%",
    scopedSlots: { customRender: "email" },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.driver.email.length - b.driver.email.length
  },
  {
    title: "Phone",
    dataIndex: "driver.contactNumber",
    width: "15%",
    scopedSlots: { customRender: "phone" },
    sorter: (a, b) =>
      a.driver.contactNumber.length - b.driver.contactNumber.length
  },
  {
    title: "Date of Birth",
    dataIndex: "driver.dateOfBirth",
    width: "15%",
    scopedSlots: { customRender: "dateOfBirth" },
    sorter: (a, b) => a.driver.dateOfBirth.length - b.driver.dateOfBirth.length
  },
  {
    title: "Address",
    dataIndex: "driver.address.streetAddress",
    scopedSlots: { customRender: "address" },
    width: "15%",
    filters: [
      {
        text: "London",
        value: "London"
      },
      {
        text: "New York",
        value: "New York"
      }
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    sorter: (a, b) =>
      a.driver.address.streetAddress.length -
      b.driver.address.streetAddress.length
  },

  {
    title: "Status",
    dataIndex: "driver.status",
    scopedSlots: { customRender: "status" },
    width: "5%",
    filters: [
      {
        text: "Active",
        value: "Active"
      },
      {
        text: "Inactive",
        value: "Inactive"
      }
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    sorter: (a, b) => a.driver.status.length - b.driver.status.length
  },
  {
    title: "Action",
    dataIndex: "operation",
    width: "15%",
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
      loading: false
    };
  },
  methods: {
    onChange,
    handleChange(value, key, column) {
      console.log(value, key, column);
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(id) {
      console.log(id);
      const newData = [...this.data];
      //const target = newData.filter(item => key === item.key)[0];
    },
    onDelete(id) {
      console.log(id);
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
</style>