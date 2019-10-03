<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <!-- mini statistic start -->
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-facebook"
            title="100+"
            sub-title="Likes"
            color="indigo"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-google"
            title="150+"
            sub-title="Connections"
            color="red"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-twitter"
            title="200+"
            sub-title="Followers"
            color="light-blue"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-instagram"
            title="50+"
            sub-title="Shots"
            color="purple"
          >
          </mini-statistic>
        </v-flex>
        <!-- mini statistic  end --> 
        <v-flex lg12 sm12 xs12>
          <h4>Absent Today - {{ moment().format('LL') }}</h4>
          <a-table :columns="columns" :dataSource="data" @change="onChange" rowKey="_id" :loading="loading">
            <a slot="name" slot-scope="text" href="javascript:;">{{text }}</a>
            
            <template slot="operation" slot-scope="text, record, index">
              <a-button type="primary" @click="addAttendance(record._id, index)"><a-icon type="edit" /></a-button>
            </template> 
          </a-table>
        </v-flex>  
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import API from "@/api";
import EChart from "@/components/chart/echart";
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import PostListCard from "@/components/widgets/card/PostListCard";
import ProfileCard from "@/components/widgets/card/ProfileCard";
import PostSingleCard from "@/components/widgets/card/PostSingleCard";
import WeatherCard from "@/components/widgets/card/WeatherCard";
import PlainTable from "@/components/widgets/list/PlainTable";
import PlainTableOrder from "@/components/widgets/list/PlainTableOrder";
import VWidget from "@/components/VWidget";
import Material from "vuetify/es5/util/colors";
import CircleStatistic from "@/components/widgets/statistic/CircleStatistic";
import LinearStatistic from "@/components/widgets/statistic/LinearStatistic";
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
    title: "Alternative",
    dataIndex: "operation",
    width: "20%",
    scopedSlots: { customRender: "operation" }
  }
];

const data = [];


function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}

export default {
  layout: "dashboard",
  components: {
    VWidget,
    MiniStatistic,
    WeatherCard,
    PostSingleCard,
    PostListCard,
    ProfileCard,
    EChart,
    CircleStatistic,
    LinearStatistic,
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      loading: false,
      checkedShiftE: false,
      checkedShiftM: false,
      confirmLoading: false,
      alternateDriver: {
        driverId: "",
        attendanceDate: {
          date: "",
          shifts: {}
        }
      }
    };
  },
  computed: {
    
  },
  methods: {
    moment,
    onChange,
    getAuthenticatedUser() {
      axios
        .get("/api/authenticated-user")
        .then(res => {
          if (res.data.user) {
            this.$store.dispatch("user/setUser", res.data);
          } else {
            this.$router.push("/login");
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
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
    this.getAuthenticatedUser();
    this.getDrivers();
  }
};
</script>
