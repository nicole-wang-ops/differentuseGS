<template>
    <div>
      <h1>Google Sheets Data</h1>
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
        refreshToken: null,
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
        const clientId = '562278447012-g8107er0h2v1s3nidqe4svp3dd6o16i2.apps.googleusercontent.com';
        const clientSecret = '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';
        const redirectUri = 'http://localhost:8082';
        const scope = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly offline_access';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
  
        const urlParams = new URLSearchParams(window.location.hash.substr(1));
        this.accessToken = urlParams.get('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
  
        // 如果首次获取了 refresh_token，将其存储在 localStorage 中
        if (urlParams.get('refresh_token')) {
          this.refreshToken = urlParams.get('refresh_token');
          localStorage.setItem('refresh_token', this.refreshToken);
        }
  
        if (!this.accessToken) {
          window.location.href = authUrl;
        } else {
          this.fetchGoogleSheetsData();
          // 定期刷新 access token
          setInterval(this.refreshAccessToken, 50 * 60 * 1000); // 每50分钟刷新一次token
        }
      },
      fetchGoogleSheetsData() {
        if (!this.accessToken) {
          this.error = 'Access token is required';
          return;
        }
  
        this.loading = true;
        const SHEET_ID = '1p0VikCs8qqlMNTuWhHkZNrvFj913wqLy5N5rSgZwNTU';
        const RANGE = 'Sheet1!A1:C1000';
  
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
  
        const SHEET_ID = '1p0VikCs8qqlMNTuWhHkZNrvFj913wqLy5N5rSgZwNTU';
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
      },
      refreshAccessToken() {
        if (!this.refreshToken) {
          this.error = 'Refresh token is not available';
          return;
        }
  
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const data = new URLSearchParams();
        data.append('client_id', '562278447012-g8107er0h2v1s3nidqe4svp3dd6o16i2.apps.googleusercontent.com');
        data.append('client_secret', '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');
        data.append('refresh_token', this.refreshToken);
        data.append('grant_type', 'refresh_token');
  
        fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: data,
        })
        .then(response => response.json())
        .then(data => {
          this.accessToken = data.access_token;
          localStorage.setItem('access_token', this.accessToken);
        })
        .catch(error => {
          this.error = 'Error refreshing access token: ' + error.message;
        });
      }
    }
  }
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  