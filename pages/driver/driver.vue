<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <v-btn class="ml-4" depressed right color="primary" @click="addDriver"><v-icon dark>add</v-icon> Add Driver</v-btn>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="operation" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                
                <a-button type="primary" @click="showModal()">Add Note</a-button>
                <a-button  @click="viewNotes(record._id), showModalViewNotes = !showModalViewNotes">View Notes</a-button>
                <a-modal v-model="showModalViewNotes" width="1200px">
                   <template slot="footer">
                    <a-button @click="handleCancel"></a-button>                    
                  </template>
                  <div style="background-color: #ececec; padding: 20px;" class="mt-4">
                    <a-row :gutter="24">
                      <a-col :span="8" v-if="userNotes.length < 1">
                        <h2>User have no notes.</h2>
                      </a-col>
                      <a-col v-else>
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
                       
                      </a-col>
                       
                    </a-row>
                   <a-pagination v-if="userNotes.length > 0" class="my-4" :v-model="1" :total="userNotes.length" /> 
                  </div>
                </a-modal>
               

                <a-button @click="showAddDocModal = !showAddDocModal, document.userId = record._id, document.userName = record.driver.name">Add Doc</a-button>
                <a-button @click="viewDocs(record._id)">View Docs</a-button>
               

                <a-button @click="() => edit(record._id)">Edit</a-button>
                 
                <a-popconfirm
                v-if="data.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record._id)">
                <a-button  type="danger" href="javascript:;">Delete</a-button>
              </a-popconfirm>
              <a-modal v-if="!isUpdateNote" title="Add note" v-model="visible" @ok="handleOk(record._id)" okText="Add note">
                <a-input class="my-4" v-model="addNote.noteName" placeholder="Note Name" />
                <a-textarea v-model="addNote.noteDetails" placeholder="Note Details" :rows="15" />
              </a-modal>
              <a-modal v-else title="Update note" v-model="visible" @ok="updateNote()" okText="Update note">
                <a-input class="my-4" v-model="addNote.noteName" placeholder="Note Name" />
                <a-textarea v-model="addNote.noteDetails" placeholder="Note Details" :rows="15" />
              </a-modal>
              </div>
                <a-modal
                  title="Add Docoment"
                  width="800px"
                  :visible="showAddDocModal"
                  @ok="addDocument"
                  okText="Submit"	
                  :confirmLoading="confirmLoading"
                  @cancel="handleCancel"
                >
                <a-form layout='vertical' :form="form">
                  <a-form-item label='Document Name' >
                    <a-input
                    append-icon="file"
                    placeholder="Please enter your document name."
                      v-decorator="[
                        'documentName',
                        {
                          rules: [{
                            required: true, message: 'Please input your document name!',
                          }]
                        }
                      ]"
                    />
                  </a-form-item>
                  <a-form-item label='Expiry Date' >
                    <a-date-picker @change="setExpiryDate" format="DD-MM-YYYY" v-bind:value=" document.expiryDate !== '' ? moment(document.expiryDate,'DD-MM-YYYY') : null"/>
                  </a-form-item>
                  <a-row :gutter="16">
                    <a-col class="gutter-row" :span="12">
                      <a-form-item label='Red Alert Date' >
                        <a-date-picker @change="setRedAlertDate" format="DD-MM-YYYY" v-bind:value=" document.redAlertDate !== '' ? moment(document.redAlertDate,'DD-MM-YYYY') : null"/>
                      </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="12">
                      <a-form-item label='Green Alert Date' >
                        <a-date-picker @change="setGreenAlertDate" format="DD-MM-YYYY" v-bind:value=" document.greenAlertDate !== '' ? moment(document.greenAlertDate,'DD-MM-YYYY') : null"/>
                      </a-form-item>    
                    </a-col>
                  
                  </a-row>
                  <a-form-item label='Add Document' >
                    <a-upload-dragger 
                    name="avatar"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    :beforeUpload="beforeUpload"
                    @change="handleChange"
                    accept="image/jpeg,image/png,.pdf"
                    v-decorator="[
                        'file',
                        {
                          rules: [{
                            required: true, message: 'Please add your file!',
                          }]
                        }
                      ]"
                    >
                      <img v-if="imageUrl" :src="imageUrl" alt="avatar"  width="640px" />
                      <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">Upload</div>
                      </div>
                      
                    </a-upload-dragger>
                  </a-form-item>
                  <a-form-item
                        label="Active"
                        >
                            <a-switch defaultChecked @change='setStatus'/>
                  </a-form-item>     
                  
                </a-form>

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
import moment from "moment";
const columns = [
  {
    title: "Name",
    dataIndex: "driver.name",
    width: "10%",
    scopedSlots: { customRender: "name" },
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.driver.name.length - b.driver.name.length
  },
  {
    title: "Email",
    dataIndex: "driver.email",
    width: "10%",
    scopedSlots: { customRender: "email" },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.driver.email.length - b.driver.email.length
  },
  {
    title: "Phone",
    dataIndex: "driver.contactNumber",
    width: "5%",
    scopedSlots: { customRender: "phone" },
    sorter: (a, b) =>
      a.driver.contactNumber.length - b.driver.contactNumber.length
  },
  // {
  //   title: "Rate per trip",
  //   dataIndex: "driver.ratePerTrip",
  //   width: "10%",
  //   scopedSlots: { customRender: "ratePerTrip" },
  //   sorter: (a, b) => a.driver.ratePerTrip.length - b.driver.ratePerTrip.length
  // },
  {
    title: "Address",
    dataIndex: "driver.address.streetAddress",
    scopedSlots: { customRender: "address" },
    width: "7%",
    sorter: (a, b) =>
      a.driver.address.streetAddress.length -
      b.driver.address.streetAddress.length
  },

  {
    title: "Status",
    dataIndex: "driver.status",
    scopedSlots: { customRender: "status" },
    width: "3%",
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
    onFilter: (value, record) => record.driver.status.indexOf(value) === 0,
    sorter: (a, b) => a.driver.status.length - b.driver.status.length
  },
  {
    title: "Action",
    dataIndex: "operation",
    width: "30%",
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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      loading: false,
      showAddDocModal: false,
      confirmLoading: false,
      showUploadFile: false,
      file: null,
      imageUrl: "",
      uploading: false,
      isDisabledUploadButton: false,
      document: {
        expiryDate: "",
        redAlertDate: "",
        greenAlertDate: "",
        status: "Active",
        userId: "",
        userName: ""
      },
      visible: false,
      readMoreActivated: false,
      showModalViewNotes: false,
      contentEditable: false,
      addNote: {},
      userNotes: [],
      isUpdateNote: false,
      noteId: '',
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    moment,
    onChange,
    setExpiryDate(date, dateString) {
      this.document.expiryDate = dateString;
    },
    setRedAlertDate(date, dateString) {
      this.document.redAlertDate = dateString;
    },
    setGreenAlertDate(date, dateString) {
      this.document.greenAlertDate = dateString;
    },
    setStatus(status) {
      if (status) {
        return (this.document.status = "Active");
      }
      this.document.status = "Inactive";
    },
    handleRemove(file) {
      this.file = null;
      this.isDisabledUploadButton = false;
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      this.file = file;
      if (!isJPG) {
        this.$message.error("You can only upload JPG or Png file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJPG && isLt2M;
    },
    showModal() {
      this.visible = true;
    },
    viewNotes(userId) {
      axios.post("/api/get-user-note", {userId}).then( res => {
        this.userNotes = res.data.notes;
      })
    },
    deleteNote(id) {
      axios.post("/api/delete-note", { id }).then(res => {
        if (res.data.success) {
          this.viewNotes();
          this.$message.success(res.data.message);
        }
      });
    },
    handleCancel() {
        console.log("function clicked")
        this.showModalViewNotes = false;
    },
    updateNote(){
      axios.post("/api/update-note", { id: this.noteId, noteName: this.addNote.noteName , noteDetails: this.addNote.noteDetails})
        .then(res => {
          if(res.data.success){
            this.$message.success(res.data.message);
          }else{
            this.$message.warning(res.data.message);
          }
        })
      this.visible = false;
    },
    editNote(id) {
      this.noteId= id;
      this.loading = true;
      this.showModalViewNotes = false;
      this.isUpdateNote = true;
      axios
        .post("/api/get-single-note", { id })
        .then(res => {
          if (res.data.success) {
            this.visible = true,
            this.loading = false,
            this.addNote = res.data.doc.note
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    cancel(e) {
      console.log(e);
      this.$message.error("Click on No");
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
    addDocument() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          const { file } = this;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("documentName", values.documentName);
          formData.append("userId", this.document.userId);
          formData.append("userName", this.document.userName);
          formData.append("expiryDate", this.document.expiryDate);
          formData.append("redAlertDate", this.document.redAlertDate);
          formData.append("greenAlertDate", this.document.greenAlertDate);
          formData.append("status", this.document.status);
          this.uploading = true;

          axios
            .post("/api/add-document", formData)
            .then(res => {
              if (res.data.success) {
                this.uploading = false;
                this.document.documentName = "";
                this.document.userId = "";
                this.document.userName = "";
                this.document.redAlertDate = "";
                this.document.expiryDate = "";
                this.document.greenAlertDate = "";
                this.document.status = "";
                this.imageUrl = "";
                this.isDisabledUploadButton = false;
                this.confirmLoading = false;
                this.$message.success(res.data.message);
                this.form.setFieldsValue({
                  documentName: ""
                });
                this.form.setFieldsValue({
                  file: null
                });

                this.showAddDocModal = false;
              }
              if (!res.data.success) {
                this.$message.warning(res.data.message);
                this.confirmLoading = false;
              }
            })
            .catch(error => {
              this.$message.warning(error);
              this.confirmLoading = false;
            });
        }
      });
    },
    handleCancel(e) {
      this.document.documentName = "";
      this.file = null;
      this.imageUrl = "";
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