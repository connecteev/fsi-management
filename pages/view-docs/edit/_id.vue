<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12 >
            <h3 class="text-xs-center">Edit Document Details</h3>
            <a-form class="v-card v-sheet theme--light pt-5 pr-5" layout='vertical' :form="form">
                <a-row :gutter="24" class="ml-5 mr-5">
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
                  
                  <a-row :gutter="24">
                    <a-col class="gutter-row" :span="8">
                        <a-form-item label='Expiry Date' v-if="isUser">
                            <div v-if="document.expiryDate">
                                <a-date-picker :defaultValue="moment(document.expiryDate, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="setExpiryDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setExpiryDate" />
                            </div>
                            
                        </a-form-item>
                    </a-col>
                    
                    <a-col class="gutter-row" :span="8">
                      <a-form-item label='Red Alert Date'   v-if="isUser">
                            <div v-if="document.expiryDate">
                                <a-date-picker :defaultValue="moment(document.redAlertDate, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="setRedAlertDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setRedAlertDate" />
                            </div>
                      </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                      <a-form-item label='Green Alert Date' v-if="isUser">
                          <div v-if="document.expiryDate">
                                <a-date-picker :defaultValue="moment(document.greenAlertDate, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="setGreenAlertDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setGreenAlertDate" />
                            </div>
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
                  <a-button class="mb-4" type="primary" size="large" @click="updateDoc">Save</a-button>
                </a-row>     
            </a-form>
        </v-flex>       
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      defaultChecked: false,
      loading: false,
      isUser: false,
      file: null,
      document: {
        expiryDate: "",
        redAlertDate: "",
        greenAlertDate: "",
        status: "Active",
        userId: "",
        userName: ""
      },
      documentId: this.$route.params.id
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    moment,
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
    getDocDetails() {
      this.loading = true;
      axios
        .post("/api/get-single-document", { id: this.documentId })
        .then(res => {
          if (res.data.success) {
            this.isUser = true;
            let documentDetails = res.data.doc.document;
            this.document = documentDetails;
            if (this.isUser) {
              this.form.setFieldsValue({
                documentName: documentDetails.documentName
              });
            }
            if (documentDetails.status == "Active") {
              this.defaultChecked = true;
            }
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateDoc(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          const { file } = this;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("documentName", values.documentName);
          formData.append("userId", this.document.userId);
          formData.append("id", this.documentId);
          formData.append("userName", this.document.userName);
          formData.append("expiryDate", this.document.expiryDate);
          formData.append("redAlertDate", this.document.redAlertDate);
          formData.append("greenAlertDate", this.document.greenAlertDate);
          formData.append("status", this.document.status);
          this.uploading = true;
          axios
            .post("/api/update-document", formData)
            .then(res => {
              if (res.data.success) {
                this.confirmLoading = false;
                this.$message.success(res.data.message);

                this.$router.push("/view-docs/" + this.document.userId);
                this.document = null;
                this.file = null;
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
    handleRemove(file) {
      this.file = null;
    },
    beforeUpload(file) {
      this.file = file;
      return false;
    }
  },
  created() {
    this.getDocDetails();
  }
};
</script>