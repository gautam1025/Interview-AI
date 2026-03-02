const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster-gg43.g4npokq.mongodb.net', (err, addresses) => {
  if (err) {
    console.error("DNS SRV resolution failed:", err);
  } else {
    console.log("DNS SRV resolution succeeded:", addresses);
  }
});
