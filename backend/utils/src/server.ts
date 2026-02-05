import dotenv from 'dotenv';
import app from './app';
import {v2 as cloudinary} from 'cloudinary';
import { startSendMailConsumer } from './consumer';
dotenv.config();


startSendMailConsumer();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const PORT = process.env.PORT || 5001 ;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});