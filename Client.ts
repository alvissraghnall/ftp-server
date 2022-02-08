import { connect } from "net";
import { PORT } from "./Index";

let remSirv = process.argv[2];

let client = connect({
  port: 1021
}, () => {
  console.log("Connected to server!");
});

client.on("connect", () => {
  console.log("client connected!");
})

//console.log(process);