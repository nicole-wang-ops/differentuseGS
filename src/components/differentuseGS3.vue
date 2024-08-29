<template>
  <div>
    <h1>Google Sheets Data5</h1>
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
      // 检查是否已经存在 refresh_token
      const refreshToken = localStorage.getItem('refresh_token');
      console.log('检查是否有 refresh_token:', refreshToken);

      if (!refreshToken) {
        // 如果没有 refresh_token，则重定向到 Google OAuth 授权页面获取
        console.log('没有找到 refresh_token，重定向到 Google 登录页面');
        this.redirectToGoogleLogin();
      } else {
        // 如果存在 refresh_token，则尝试获取 access_token
        console.log('找到 refresh_token，尝试获取 access_token');
        this.fetchAccessToken(refreshToken);
      }
    },
    redirectToGoogleLogin() {
      const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;
      const scope = 'https://www.googleapis.com/auth/spreadsheets';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

      console.log('重定向到:', authUrl);

      // 重定向到 Google 授权页面以获取 refresh_token
      window.location.href = authUrl;
    },
    async fetchAccessToken(refreshToken) {
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            client_secret: process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          })
        });

        const data = await response.json();
        console.log('获取 access_token 的响应:', data);

        if (data.access_token) {
          this.accessToken = data.access_token;
          localStorage.setItem('access_token', data.access_token);
          console.log('access_token 获取成功并存储在 localStorage 中');
          this.fetchGoogleSheetsData(); // 获取 Google Sheets 数据
        } else {
          this.error = 'Failed to retrieve access token.';
          console.log('获取 access_token 失败:', data);
        }
      } catch (error) {
        this.error = 'Error fetching access token: ' + error.message;
        console.log('获取 access_token 时发生错误:', error);
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
          console.log('成功获取 Google Sheets 数据:', this.sheetsData);
        })
        .catch(error => {
          this.error = 'Error fetching data: ' + error.message;
          this.loading = false;
          console.log('获取 Google Sheets 数据时发生错误:', error);
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
        console.log('成功添加新行:', data);
      })
      .catch((error) => {
        this.error = 'Error adding row: ' + error.message;
        console.log('添加新行时发生错误:', error);
      });
    }
  }
}
</script>

<style scoped>
/* Your styles here */
</style>
