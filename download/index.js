require('dotenv').config();
require('./lib/downloader').doDownload(process.argv[2] === 'all');
