import { createServer, Socket } from "net";
import Handler from "./Worker";

export const PORT = /**Number.parseInt(process.env.PORT) || */1025;

let noOfConn = 0;
let clientSocket: Socket;
let dataPort: number;

const server = createServer(socket => {
  //socket.pipe(process.stdout);
  //console.log(socket);
  
  socket.write("\nWelcome to the Álviss Raghnall Foundation😏  FTP Server. Please enter a command. \n");
  socket.pipe(socket);
  clientSocket = socket;
  
})  /**
 Creates a new instance of the Handler class on every client connection.
*/
.on("connection", async () => {
  server.getConnections((err, count) => {
    if(err) throw err;
    noOfConn = count;
    console.log(noOfConn);
  });
  
  
  dataPort = PORT + noOfConn + 1;
  const handler = new Handler(clientSocket, dataPort);
    //if(err) throw err;
    //return count;
  //console.log('connected! outside!!')
})
.on("error", () => { 
  throw new Error("Could not create server.") 
  process.exit();
})


server.listen({
  port: PORT,
  host: "127.0.0.1"
}, () => {
  console.log(`FTP Server up and running on port ${PORT}`);
  console.log(server.address());
});

// server.close((err: unknown) => {
//   const e = <Error>err;
//   if(e){
//     console.error("Server was unable to be closed for whatever reason.");
//     process.exit(-1);
//   }
//   console.log("Server was closed successfully.");
// });