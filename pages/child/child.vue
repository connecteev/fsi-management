<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <v-btn class="ml-4" depressed right color="primary" @click="addChild"><v-icon dark>add</v-icon> Add Child</v-btn>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
            <template slot="operation" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                <a-button type="primary" @click="showModal()">Add Note</a-button>
                <a-button  @click="viewNotes(record._id), showModalViewNotes = !showModalViewNotes">View Notes</a-button>
                <a-modal v-model="showModalViewNotes" width="1200px">
                   <template slot="footer">
                    <a-button key="back" @click="handleCancel">Return</a-button>                    
                  </template>
                  <div style="background-color: #ececec; padding: 20px;">
                    <a-row :gutter="16">
                      <a-col :span="8">
                        <a-card title="Card title" :bordered="false">
                          <p>card content</p>
                          <template class="ant-card-actions" slot="actions">
                            
                            <a-icon type="edit" />
                            <a-icon type="ellipsis" />
                          </template>
                        </a-card>
                      </a-col>
                      <a-col :span="8">
                        <a-card title="Card title" :bordered="false">
                          <p>card content</p>
                          <template class="ant-card-actions" slot="actions">
                            
                            <a-icon type="edit" />
                            <a-icon type="ellipsis" />
                          </template>
                        </a-card>
                      </a-col>
                      <a-col :span="8">
                        <a-card title="Card title" :bordered="false">
                          <p>card content</p>
                          <template class="ant-card-actions" slot="actions">
                            
                            <a-icon type="edit" />
                            <a-icon type="ellipsis" />
                          </template>
                        </a-card>
                      </a-col>
                    </a-row>
                  </div>
                </a-modal>
                <a-button @click="() => edit(record._id)">Edit</a-button>
                <a-popconfirm
                  v-if="data.length"
                  title="Sure to delete?"
                  @confirm="() => onDelete(record._id)" >
                    <a-button href="javascript:;" type="danger">Delete</a-button>
                </a-popconfirm> 
              </div>
              <a-modal title="Add note" v-model="visible" @ok="handleOk(record._id)" okText="Add note">
                <a-input class="my-4" v-model="addNote.noteName" placeholder="Note Name" />
                <a-textarea v-model="addNote.noteDetails" placeholder="Note Details" :rows="4" />
              </a-modal>
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
    dataIndex: "child.name",
    width: "15%",
    scopedSlots: { customRender: "name" },
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.child.name.length - b.child.name.length
  },
  {
    title: "Email",
    dataIndex: "child.email",
    width: "10%",
    scopedSlots: { customRender: "email" },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.child.email.length - b.child.email.length
  },
  {
    title: "Dad Phone",
    dataIndex: "child.contactNumber",
    width: "10%",
    scopedSlots: { customRender: "phone" },
    sorter: (a, b) =>
      a.child.contactNumber.length - b.child.contactNumber.length
  },
  {
    title: "Route",
    dataIndex: "child.routeNumber",
    width: "5%",
    scopedSlots: { customRender: "routeNumber" },
    sorter: (a, b) => a.child.routeNumber.length - b.child.routeNumber.length
  },
  {
    title: "Assigned Driver",
    dataIndex: "child.assignedDriver.driverName",
    width: "10%",
    scopedSlots: { customRender: "driverName" },
    sorter: (a, b) =>
      a.child.assignedDriver.driverName - b.child.assignedDriver.driverName
  },
  {
    title: "Address",
    dataIndex: "child.address.streetAddress",
    scopedSlots: { customRender: "address" },
    width: "15%",
    sorter: (a, b) =>
      a.child.address.streetAddress.length -
      b.child.address.streetAddress.length
  },

  {
    title: "Status",
    dataIndex: "child.status",
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
    onFilter: (value, record) => record.child.status.indexOf(value) === 0,
    sorter: (a, b) => a.child.status.length - b.child.status.length
  },
  {
    title: "Action",
    dataIndex: "operation",
    width: "30%",
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
      visible: false,
      showModalViewNotes: false,
      addNote: {}
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
    showModal() {
      this.visible = true;
    },
    viewNotes() {

    },
    handleCancel(e) {
        this.showModalViewNotes = false;
    },
    handleOk(userId) {
      this.addNote.userId = userId;
      axios.post("/api/add-note", this.addNote)
        .then(res => {
          if(res.data.success){
            this.$message.success(res.data.message);
          }
        })
      this.visible = false;
    },
    edit(id) {
      this.$router.push(`/child/update-child/${id}`);
    },
    onDelete(id) {
      axios
        .post("/api/delete-child", {
          id
        })
        .then(res => {
          if (res.data.success) {
            this.getAllChild();
            this.$message.success(res.data.message);
          }
        });
    },
    addChild() {
      this.$router.push("/child/create-child");
    },
    getAllChild() {
      this.loading = true;
      axios.get("/api/get-all-child").then(res => {
        if (res.data.success) {
          this.data = res.data.childs;
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.getAllChild();
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>