<!-- <template>
  <div>
    <h1>Google Sheets Data2</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <table v-if="sheetsData.length">
      <tr v-for="(row, rowIndex) in sheetsData" :key="rowIndex">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
      </tr>
    </table>

    <h3>Add New Entry</h3>
    <div>
      <label for="id">ID:</label>
      <input id="id" v-model="newEntry.id" placeholder="Enter ID" />
    </div>
    <div>
      <label for="name">Name:</label>
      <input id="name" v-model="newEntry.name" placeholder="Enter Name" />
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" v-model="newEntry.password" placeholder="Enter Password" />
    </div>
    <button @click="addRow">Add New Row</button>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data() {
    return {
      sheetsData: [],
      loading: false,
      error: null,
      accessToken: null,
      newEntry: {
        id: '',
        name: '',
        password: ''
      }
    };
  },
  mounted() {
    this.initClient();
  },
  methods: {
    initClient() {
      const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;
      const scope = 'https://www.googleapis.com/auth/spreadsheets';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

      const urlParams = new URLSearchParams(window.location.hash.substr(1));
      this.accessToken = urlParams.get('access_token');

      if (!this.accessToken) {
        window.location.href = authUrl;
      } else {
        window.history.pushState({},null,window.location.pathname);
        this.fetchGoogleSheetsData();
      }
    },
    fetchGoogleSheetsData() {
      if (!this.accessToken) {
        this.error = 'Access token is required';
        return;
      }

      this.loading = true;
      const SHEET_ID = process.env.VUE_APP_GOOGLE_SHEET_ID;
      const RANGE = process.env.VUE_APP_GOOGLE_SHEET_RANGE;

      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?access_token=${this.accessToken}`)
        .then(response => response.json())
        .then(data => {
          this.sheetsData = data.values || [];
          this.loading = false;
        })
        .catch(error => {
          this.error = 'Error fetching data: ' + error.message;
          this.loading = false;
        });
    },
    addRow() {
      if (!this.accessToken) {
        this.error = 'Access token is required';
        return;
      }

      if (!this.newEntry.id || !this.newEntry.name || !this.newEntry.password) {
        this.error = 'All fields are required';
        return;
      }

      const SHEET_ID = process.env.VUE_APP_GOOGLE_SHEET_ID;
      const RANGE = 'Sheet1';

      const valueRangeBody = {
        values: [
          [this.newEntry.id, this.newEntry.name, this.newEntry.password]
        ],
      };

      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(valueRangeBody)
      })
      .then(response => response.json())
      .then(data => {
        this.fetchGoogleSheetsData(); // 添加行后刷新数据
        this.newEntry.id = '';
        this.newEntry.name = '';
        this.newEntry.password = '';
      })
      .catch((error) => {
        this.error = 'Error adding row: ' + error.message;
      });
    }
  }
}
</script>

<style scoped>
/* Your styles here */
</style> -->
