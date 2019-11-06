<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <v-btn class="ml-4" depressed right color="primary" @click="addChild"><v-icon dark>add</v-icon> Add Child</v-btn>
          <a-table :columns="columns" :dataSource="sortUserAlphabeticaly" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
            <template slot="operation" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                <a-button type="primary" @click="showModal(record._id)">Add Note</a-button>
                <a-button  @click="viewNotes(record._id), showModalViewNotes = !showModalViewNotes">View Notes</a-button>
                <a-modal v-model="showModalViewNotes" width="1200px">
                   <template slot="footer">
                    <a-button key="back" @click="handleCancel()">Return</a-button>                    
                  </template>
                  <div style="background-color: #ececec; padding: 20px;" class="mt-4">
                    <a-row :gutter="24">
                      <a-col :span="8" v-if="userNotes.length < 1">
                        <h2>User have no notes.</h2>
                      </a-col>
                      <a-row :gutter="24" v-else>
                        <a-col :span="8" v-for="(item, index) in userNotes" :key="index" >
                          <a-card :title="item.note.noteName" :bordered="false">
                            
                            <div v-if="!readMoreActivated">
                              <div v-if="item.note.noteDetails.length > 60">
                                {{item.note.noteDetails.length}}
                                {{ item.note.noteDetails.slice(0, 60) }}
                                <br>
                                <a v-if="item.note.noteDetails.length > 60" @click="readMoreActivated = true">Read more</a>
                              </div>
                              <div v-else>
                                {{ item.note.noteDetails }}
                              </div>
                              
                            </div>
                            <div v-else>
                                {{ item.note.noteDetails }}
                                <br>
                                <a @click="readMoreActivated = false">Read less</a>
                            </div>
                            
                            <template class="ant-card-actions" slot="actions">
                              <a-tooltip placement="top" >
                                <template slot="title">
                                  <span>Edit</span>
                                </template>
                                <a-icon type="edit" @click="editNote(item._id), contentEditable = true" />
                              </a-tooltip>
                              <a-tooltip placement="top" >
                                <template slot="title">
                                  <span>Delete</span>
                                </template>
                                <a-popconfirm title="Are you sure delete this file?" @confirm="deleteNote(item._id)" @cancel="cancel" okText="Yes" cancelText="No">
                                  <a-icon type="delete" />
                                </a-popconfirm>
                              </a-tooltip>
                            </template>
                          </a-card>
                        </a-col>
                        
                      </a-row>
                      
                    </a-row>
                    <a-pagination v-if="userNotes.length > 0" class="my-4" :v-model="1" :total="userNotes.length" />  
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
              <a-modal v-if="!isUpdateNote" title="Add note" v-model="visible" @ok="addNoteToDb()" okText="Add note">
                <a-input class="my-4" v-model="addNote.noteName" placeholder="Note Name" />
                <a-textarea v-model="addNote.noteDetails" placeholder="Note Details" :rows="15" />
              </a-modal>
              <a-modal v-else title="Update note" v-model="visible" @ok="updateNote()" okText="Update note">
                <a-input class="my-4" v-model="addNote.noteName" placeholder="Note Name" />
                <a-textarea v-model="addNote.noteDetails" placeholder="Note Details" :rows="15" />
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
    title: "D.O.B",
    dataIndex: "child.dateOfBirth",
    width: "8%",
    scopedSlots: { customRender: "dateOfBirth" },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.child.dateOfBirth.length - b.child.dateOfBirth.length
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
    title: "Assigned PA",
    dataIndex: "child.assignedPa.paName",
    width: "10%",
    scopedSlots: { customRender: "paName" },
    sorter: (a, b) => a.child.assignedPa.paName - b.child.assignedPa.paName
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
      readMoreActivated: false,
      showModalViewNotes: false,
      contentEditable: false,
      addNote: {},
      addNoteUserId: "",
      userNotes: [],
      isUpdateNote: false,
      noteId: ""
    };
  },
  computed: {
    sortUserAlphabeticaly(){
      return _.sortBy(this.data, [function(o) { return o.child.name; }]);
    }
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
    showModal(userId) {
      this.visible = true;
      this.addNoteUserId = userId
    },
    viewNotes(userId) {
      axios.post("/api/get-user-note", { userId }).then(res => {
        this.userNotes = res.data.notes;
      });
    },
    deleteNote(id) {
      axios.post("/api/delete-note", { id }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message);
          this.showModalViewNotes = false;
        }
      });
    },
    handleCancel() {
      this.showModalViewNotes = false;
    },
    updateNote() {
      axios
        .post("/api/update-note", {
          id: this.noteId,
          noteName: this.addNote.noteName,
          noteDetails: this.addNote.noteDetails
        })
        .then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            this.addNote = {};
            this.noteId = "";
            this.isUpdateNote = false;
          } else {
            this.$message.warning(res.data.message);
          }
        });
      this.visible = false;
    },
    editNote(id) {
      this.noteId = id;
      this.loading = true;
      this.showModalViewNotes = false;
      this.isUpdateNote = true;
      axios
        .post("/api/get-single-note", { id })
        .then(res => {
          if (res.data.success) {
            (this.visible = true),
              (this.loading = false),
              (this.addNote = res.data.doc.note);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addNoteToDb() {
       this.addNote.userId = this.addNoteUserId;
      axios.post("/api/add-note", this.addNote).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message);
          this.addNote = {};
          this.addNoteUserId = ""
        }
      });
      this.visible = false;
    },
    cancel(e) {
      console.log(e);
      this.$message.error("Click on No");
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