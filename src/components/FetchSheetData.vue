<!-- <template>
    <div>
      <h1>Google Sheets Data</h1>
      <div v-if="sheetData">
        <table>
          <tr v-for="(row, index) in sheetData" :key="index">
            <td v-for="(cell, i) in row" :key="i">{{ cell }}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        Loading data...
      </div>
    </div>
  </template>
  
  <script>
  import { google } from 'googleapis';
  
  export default {
    data() {
      return {
        sheetData: null,
      };
    },
    mounted() {
      this.loadSheetData();
    },
    methods: {
      async loadSheetData() {
        const credentials = {
          type: "service_account",
          project_id: "gpts-427506",
          private_key_id: "9cbde5bc1192ded9a776854731e9ceb8b058242c",
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDijfR9+I1+MRtU\nSYtf8QUWVgpQl/ubg6JZWHGOltoUEVIcaMOuMujCk5J2JyShRsdksHwRl/48xLHz\nqtiUO9LddMRqY4vES0HY9mMROyQn41o/cxBydfhCQAZ8+2YxfmU+7Sd5D/6DtVuX\nawTWNHBdGryvDW6/E0QpU/e/DacRPSNlkMo1cwAWeIxcEdROxomAf64NRaxSsLBI\nY6hEMBDK9mgnTUYa/9/w1EJj4LkaIXQpM1zDT+9wFQRC9wjfdXXGb58XJZYGi/yn\nVfeUIg8eLbiYIU61Ca4Ot7um7cUopgujVbPsmz02CQ2UVtCRR05BxM9EmP7dXnD9\n1JzfAXOTAgMBAAECggEABIcwEp03VUiIjxCHBxuVgcmzWNBXJgbNvUcmLhht0STP\nYCQJsZ3BqLoiuDvh/u+E3+wH1EMjufJqelDk0ipGJMkHEcGae5BWPVizwZ0sH78F\n4nTReVzQ7zTIVoVP6X+zGBQ4yFp4Z5zs42BQ3MY02rjLNucafEKa+hNTvovx3KWz\nW7k+LBkLByaQlc7gSr8kHAIWFgPwietRoYs0+/qUeo3RWzA14tVtuM72rS/Ayy9S\ng3Gp4yhxO6TSU919TiVyN+1yVBJgjwa55zVvnkHruAwG5LWgdlnlDz1YDSVuVEOg\nOs5tCqlgKGHjglujL2ZYAJ5jlNPh25Zt04uWkOF7sQKBgQD6zvecBuHB75eZoPMw\n+WoYfqSZnDOwkSgaoVN6K70B5DE9e6QiHoI6YqsM8Ce1bclQE8NDe0gjLNrYg05/\nGC4fTrhWB+D/gQtE0xWRwx3M1dhDe8yfOLQoH9OhDh97fSof0JhAxb8n8jrcEJZE\nQLJPdrwSnEKpogtyaQ/E16p8wwKBgQDnPndb3mUkNpAGsMtu6T1VPbmRvVp/DqRD\n9HKf6Gex7FgOl8o80v2x6gxSnCv/k3MKv3yvpnyaxhwNlrlMGIw7HDfQYJefzu1e\n2Zna+wnuZ3f5duR5jHcW4G/k7hu6TscDJSoc7jF6qGbCoGWBivtePJMoC5OAB1E3\nYHLxelYA8QKBgGe+1vOmcRoMpnP4/L+kW/uX3zRfRY5i7OjfFK2zi/JNVwTssP8g\nCZRnHgQzDungaOaD1kCCrVtHgZsP7ZdrBCEVKfEEP1DRKz0j54cs45XIWzXG7uRp\nyzPRvnOfaOxm4NbaLTCV27WFYE2JWu8Op/Nw1OkJ1BVhH0ULKmetIiuLAoGACRip\n9VEwRVZoH/tAZWKDaSD+db8vGiRnTc0F3Uh1G8iiRiCuceoS1LbSOUWvbWRNeDTE\nINy5thTo8ZfmPhoRGhooD+hczoqDR+HjbXvGjjw/ue51WlquLJYzkJvVN2T16yfB\nGlY8WAjb0fghRhFDhhd36nFaIgUnqrf+jYU0cOECgYEAxRHbJbQCPs0FEKeBIG+G\n3FzeFF8k9+I5G+XVJUNZZb/ic8tjS+ohXdK12/XN1GwrapfMRzI1AK135DBVWd1P\n3fL2ph/c+ODK7maj3lGmSo++bhWBWBH++tQrWSSTW77U+nv9tVN4QsrT8ngmcb1f\nwqFPvhhRdw5FzNNV7M7m0Xo=\n-----END PRIVATE KEY-----\n",
          client_email: "vue28765@gpts-427506.iam.gserviceaccount.com",
          client_id: "102083315428742238097",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/vue28765%40gpts-427506.iam.gserviceaccount.com"
        };
  
        const client = new google.auth.JWT(
          credentials.client_email,
          null,
          credentials.private_key,
          ['https://www.googleapis.com/auth/spreadsheets.readonly']
        );
  
        const sheets = google.sheets({ version: 'v4', auth: client });
  
        try {
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1p0VikCs8qqlMNTuWhHkZNrvFj913wqLy5N5rSgZwNTU',
            range: 'Sheet1!A1:E10',
          });
  
          this.sheetData = response.data.values;
        } catch (error) {
          console.error('Error fetching data from Google Sheets:', error);
        }
      },
    },
  };
  </script>
   -->