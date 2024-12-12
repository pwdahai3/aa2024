import elasticsearch from "elasticsearch"
import {SERVER_API_IP} from '@/conf/constvar'
// var client = new elasticsearch.Client({
//   host: '192.168.2.201:9201',
// });

var client = new elasticsearch.Client({
  host: {
    protocol: 'https',
    host: SERVER_API_IP,
    port: 443,
    path: '/es',
  },
  requestTimeout: 300000,
});

export default client;
