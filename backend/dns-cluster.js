const fs = require('fs');
const dns = require('dns');
dns.setServers(['8.8.8.8']);

const srv = '_mongodb._tcp.cluster-gg43.g4npokq.mongodb.net';
const txt = 'cluster-gg43.g4npokq.mongodb.net';

dns.resolveSrv(srv, (err, addresses) => {
  if (err) { console.error(err); return; }
  dns.resolveTxt(txt, (err2, txtRec) => {
    let options = err2 ? '' : txtRec.flat().join('&');
    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    
    fs.writeFileSync('uri.txt', `mongodb://${hosts}/?ssl=true&` + options);
  });
});
