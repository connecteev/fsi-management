<template>
  <div>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12 sm12 xs12 >
            <h3 class="text-xs-center">Edit Document Details</h3>
            <a-form v-if="document" class="v-card v-sheet theme--light pt-5 pr-5" layout='vertical' :form="form">
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
                                <a-date-picker :defaultValue="moment(document.expiryDate, 'DD-MM-YYYY')" format="DD-MM-YYYY" @change="setExpiryDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setExpiryDate" format="DD-MM-YYYY" />
                            </div>
                            
                        </a-form-item>
                    </a-col>
                    
                    <a-col class="gutter-row" :span="8">
                      <a-form-item label='Red Alert Date'   v-if="isUser">
                            <div v-if="document.expiryDate">
                                <a-date-picker :defaultValue="moment(document.redAlertDate, 'DD-MM-YYYY')" format="DD-MM-YYYY" @change="setRedAlertDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setRedAlertDate" />
                            </div>
                      </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                      <a-form-item label='Green Alert Date' v-if="isUser">
                          <div v-if="document.expiryDate">
                                <a-date-picker :defaultValue="moment(document.greenAlertDate, 'DD-MM-YYYY')" format="DD-MM-YYYY" @change="setGreenAlertDate" />
                            </div>
                            <div v-else>
                                <a-date-picker @change="setGreenAlertDate" />
                            </div>
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
                        <img v-if="imageUrl" :src="imageUrl" alt="Document | File Image" width="640px" />
                        <img v-else-if="document.documentPath" :src="document.documentPath" alt="Document | File Image" width="640px">
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
                  <a-button class="mb-4" type="primary" size="large" @click="updateDoc" :loading="loading">Save</a-button>
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

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      defaultChecked: false,
      loading: false,
      isUser: false,
      file: null,
      imageUrl: '',
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
      this.loading = true;
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          
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
                this.loading = false;
                
                this.$message.success(res.data.message);

                this.$router.push("/view-docs/" + this.document.userId);
                this.document = null;
                this.file = null;
              }
              if (!res.data.success) {
                this.$message.warning(res.data.message);
                this.loading = false;
              }
            })
            .catch(error => {
              this.$message.warning(error);
              this.loading = false;
            });
        }
      });
    },
    handleRemove(file) {
      this.file = null;
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      this.file = file;
      if (!isJPG) {
        this.$message.error('You can only upload JPG or Png file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
  created() {
    this.getDocDetails();
  }
};
</script>