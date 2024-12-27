import app from "./app";
import mongoose from 'mongoose'
import config from './app/config/index'

async function save() {
  try {
    await mongoose.connect(config.databaseURL as string);

  
    app.listen(config.port, () => {
      console.log(`Alhamdulillah app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

save();