<template>
  <div>
    <a-row :gutter="24" class="ml-2 mr-3 " v-if="userDocs.length > 0">
      <h4 class="text-xs-center ">Documents for {{userDocs[0].document.userName}} <a-divider class="grey--text" type="vertical" /> Total files {{userDocs.length}}</h4>  
      <a-col class="gutter-row" :span="6"  v-for="(items, index) in userDocs"
        :key="index">
        <a-card
        hoverable
        style="width: 300px"
        >
        <img src="" alt="">
        <img
            alt="example"
            :src="`../${items.document.documentPath}`"
            slot="cover"
        />
        <template class="ant-card-actions" slot="actions">
            <a-tooltip placement="top" >
              <template slot="title">
                <span>View</span>
              </template>
              <a href="@/static/fsi-logo.png" target="_blank" download><a-icon type="eye" /></a>
            </a-tooltip>
            <a-tooltip placement="top" >
              <template slot="title">
                <span>Edit</span>
              </template>
              <a-icon type="edit" @click="editDoc(items._id)" />
            </a-tooltip>
            <a-tooltip placement="top" >
              <template slot="title">
                <span>Delete</span>
              </template>
              <a-popconfirm title="Are you sure delete this file?" @confirm="deleteDoc(items._id)" @cancel="cancel" okText="Yes" cancelText="No">
                <a-icon type="delete" />
              </a-popconfirm>
            </a-tooltip>
        </template>
        <a-card-meta
            :title="items.document.documentName"
            :description="`Exipires on: ${items.document.expiryDate}`">
        </a-card-meta>
      </a-card>
        
      </a-col>
    </a-row>
      
  </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      userId: this.$route.params.id,
      userDocs: []
    };
  },

  methods: {
    deleteDoc(id) {
      axios.post("/api/delete-document", { id }).then(res => {
        if (res.data.success) {
          this.getUserDocs();
          this.$message.success(res.data.message);
        }
      });
    },
    cancel(e) {
      console.log(e);
      this.$message.error("Click on No");
    },
    getUserDocs() {
      axios
        .post("/api/get-user-document", { userId: this.userId })
        .then(res => {
          if (res.data.success) {
            this.userDocs = res.data.documents;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    editDoc(id) {
      this.$router.push(`/view-docs/edit/${id}`);
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true;
          this.driver.name = values.name;
          this.driver.email = values.email;
          this.driver.contactNumber = values.phone;
          this.driver.address.streetAddress = values.address;
          this.driver.ratePerTrip = values.ratePerTrip;
          axios
            .post("/api/update-driver", { ...this.driver, id: this.userId })
            .then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$message.success(res.data.message);
                this.$router.push("/driver/driver");
              } else {
                this.$message.warning(res.data.message);
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err);
            });
        }
      });
    }
  },
  created() {
    this.getUserDocs();
  }
};
</script>