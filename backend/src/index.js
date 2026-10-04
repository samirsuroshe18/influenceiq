// must stay first: ES imports are hoisted, and the modules below read process.env
import 'dotenv/config';
import connectDB from './database/database.js';
import app from './app.js';
import { ensureSample } from './analysis/sample.js';
import { Dataset } from './models/dataset.model.js';
import { Usage } from './models/usage.model.js';

const PORT = process.env.PORT || 3003;

connectDB().then(async () => {
    // the limits rely on the unique index, and uploads on the one that removes them:
    // both are in place before the first request
    await Promise.all([Dataset.init(), Usage.init()]);

    // the sample is rebuilt at every start, so its dates stay recent; a failure here
    // must not keep the server from starting
    await ensureSample().catch((error) => console.log(`The sample dataset could not be built: ${error.message}`));

    app.listen(PORT, process.env.SERVER_HOST, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err) => {
    console.log('MongoDB Failed !!!', err);
});
