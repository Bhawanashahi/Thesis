const cloudinary = require("cloudinary");
module.exports = {
  upload(req, res) {
    //Create a new Date instance.then get the time and divide it by a thousand, then have it within Math.round();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const api_secret = process.env.CLOUDINARY_API_SECRET;

    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp },
      api_secret
    );
    const payload = {
      timestamp,
      signature
    };
    res.status(200).json({ payload });
  }
};
