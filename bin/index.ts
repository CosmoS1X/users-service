import 'dotenv/config';
import debug from 'debug';
import app from '../src';

const port = process.env.PORT || 5000;
const log = debug('server:log');
const errorLog = debug('server:error');

app
  .listen(port, () => {
    log(`✅ Server is running on http://localhost:${port}`);
  })
  .on('error', (error) => {
    errorLog('❌ Server error:', error.message);
    process.exit(1);
  });
