<template>
  <div >
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12>
          <v-btn class="ml-4" depressed right color="primary" @click="addPa"><v-icon dark>add</v-icon> Add Passenger Assistant</v-btn>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="operation" slot-scope="text, record, index">
              <div class='editable-row-operations'>
                <a @click="showAddDocModal = !showAddDocModal, document.userId = record._id, document.userName = record.pa.name">Add Doc</a>
                <a @click="viewDocs(record._id)">View Docs</a>
                <a-divider type="vertical" />
                <a @click="() => edit(record._id)">Edit</a>
                 <a-divider type="vertical" />
                <a-popconfirm
                v-if="data.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record._id)">
                <a href="javascript:;">Delete</a>
              </a-popconfirm>
              </div>
               <a-modal
                  title="Add Docoment"
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
                    <a-date-picker @change="setExpiryDate" />
                  </a-form-item>
                  <a-row :gutter="16">
                    <a-col class="gutter-row" :span="12">
                      <a-form-item label='Red Alert Date' >
                        <a-date-picker @change="setRedAlertDate" />
                      </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="12">
                      <a-form-item label='Green Alert Date' >
                        <a-date-picker @change="setGreenAlertDate" />
                      </a-form-item>    
                    </a-col>
                  
                  </a-row>
                  <a-form-item label='Add Document' >
                    <a-upload-dragger name="file" 
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload"
                    :multiple="false"
                    listType="picture"
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
                      <p class="ant-upload-drag-icon">
                        <a-icon type="inbox" />
                      </p>
                      <p class="ant-upload-text">Click or drag file to this area to upload</p>
                      
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

const columns = [
  {
    title: "Name",
    dataIndex: "pa.name",
    width: "15%",
    scopedSlots: { customRender: "name" },
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.pa.name.length - b.pa.name.length
  },
  {
    title: "Email",
    dataIndex: "pa.email",
    width: "15%",
    scopedSlots: { customRender: "email" },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.pa.email.length - b.pa.email.length
  },
  {
    title: "Phone",
    dataIndex: "pa.contactNumber",
    width: "10%",
    scopedSlots: { customRender: "phone" },
    sorter: (a, b) => a.pa.contactNumber.length - b.pa.contactNumber.length
  },
  // {
  //   title: "Rate per trip",
  //   dataIndex: "pa.ratePerTrip",
  //   width: "10%",
  //   scopedSlots: { customRender: "ratePerTrip" },
  //   sorter: (a, b) => a.pa.ratePerTrip.length - b.pa.ratePerTrip.length
  // },
  {
    title: "Address",
    dataIndex: "pa.address.streetAddress",
    scopedSlots: { customRender: "address" },
    width: "15%",
    sorter: (a, b) =>
      a.pa.address.streetAddress.length - b.pa.address.streetAddress.length
  },

  {
    title: "Status",
    dataIndex: "pa.status",
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
    onFilter: (value, record) => record.pa.status.indexOf(value) === 0,
    sorter: (a, b) => a.pa.status.length - b.pa.status.length
  },
  {
    title: "Action",
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
      showAddDocModal: false,
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
    },
    beforeUpload(file) {
      this.file = file;
      return false;
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
          console.log("Received values of form: ", values);
          axios
            .post("/api/add-document", formData)
            .then(res => {
              if (res.data.success) {
                this.confirmLoading = false;
                this.$message.success(res.data.message);
                this.document = null;
                this.file = null;
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
      console.log("Clicked cancel button");
      this.showAddDocModal = false;
    },
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
      this.$router.push(`/pa/update-pa/${id}`);
    },
    onDelete(id) {
      axios
        .post("/api/delete-pa", {
          id
        })
        .then(res => {
          if (res.data.success) {
            this.getAllPa();
            this.$message.success(res.data.message);
          }
        });
    },
    addPa() {
      this.$router.push("/pa/create-pa");
    },
    getAllPa() {
      this.loading = true;
      axios.get("/api/get-all-pa").then(res => {
        if (res.data.success) {
          this.data = res.data.pas;
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.getAllPa();
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>