// must stay first: ES imports are hoisted, and the modules below read process.env
import 'dotenv/config';
import connectDB from './database/database.js';
import app from './app.js';
import { ensureSample } from './analysis/sample.js';

const PORT = process.env.PORT || 3003;

connectDB().then(async () => {
    // the sample is rebuilt at every start, so its dates stay recent; a failure here
    // must not keep the server from starting
    await ensureSample().catch((error) => console.log(`The sample dataset could not be built: ${error.message}`));

    app.listen(PORT, process.env.SERVER_HOST, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err) => {
    console.log('MongoDB Failed !!!', err);
});
