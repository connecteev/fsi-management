<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        
        <v-flex lg12 sm12 xs12>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id">
            <template v-for="col in ['name', 'email', 'phone', 'dateOfBirth', 'address', 'status']" :slot="col" slot-scope="text, record, index">
              
              <div :key="col">
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>{{text}}</template>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                <span v-if="record.editable">
                  <a @click="() => save(record.key)">Save</a>
                  <a-popconfirm title='Sure to cancel?' @confirm="() => cancel(record.key)">
                    <a>Cancel</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="() => edit(record.key)">Edit</a>
                </span>
                <a-popconfirm
                v-if="data.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record.key)">
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
    filters: [
      {
        text: "Joe",
        value: "Joe"
      },
      {
        text: "Jim",
        value: "Jim"
      },
      {
        text: "Submenu",
        value: "Submenu",
        children: [
          {
            text: "Green",
            value: "Green"
          },
          {
            text: "Black",
            value: "Black"
          }
        ]
      }
    ],

    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length
  },
  {
    title: "Email",
    dataIndex: "driver.email",
    width: "15%",
    scopedSlots: { customRender: "email" },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length
  },
  {
    title: "Phone",
    dataIndex: "driver.contactNumber",
    width: "15%",
    scopedSlots: { customRender: "phone" },
    sorter: (a, b) => a.age - b.age
  },
  {
    title: "Date of Birth",
    dataIndex: "driver.dateOfBirth",
    width: "15%",
    scopedSlots: { customRender: "dateOfBirth" },
    sorter: (a, b) => a.age - b.age
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
    sorter: (a, b) => a.address.length - b.address.length
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
    sorter: (a, b) => a.status.length - b.status.length
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
      columns
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
    edit(key) {
      console.log(key);
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter(item => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
    getDrivers() {
      axios.get("/api/get-drivers").then(res => {
        if (res.data.success) {
          this.data = res.data.drivers;
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