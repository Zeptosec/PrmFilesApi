const limit = 15;
let amount = 0;
let reserved = 0;

const rateLimiter = (req, res, next) => {
  console.log(amount);
  // this reserve system sill doest prevent spam
  // when someone will spam into upload if someone reserves others can occupy
  if (amount >= reserved) {
    return res
      .status(429)
      .json({ error: "Limit reached reserve the slot first" });
  } else {
    let tout;
    req.on("close", function () {
      tout = setTimeout(() => {
        reserved = Math.max(0, reserved - 1);
        amount = Math.max(0, amount - 1);
        return res.status(400).json({ error: "You took too long." });
      }, 1 * 60 * 1000);
    });

    res.on("finish", function () {
      console.log("response was finished");
      if(tout != null)
      clearTimeout(tout);
      reserved = Math.max(0, reserved - 1);
      amount = Math.max(0, amount - 1);
    });
    amount++;
    next();
  }
};

const reserve = (req, res) => {
  if (reserved >= limit) {
    return res
      .status(200)
      .json({ error: "Limit reached wait for others to finish" });
  }
  reserved += 1;
  return res.status(202).json({ success: "You can upload now" });
};
module.exports = { rateLimiter, reserve };
