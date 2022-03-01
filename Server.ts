import { createServer, Socket } from "net";
import Handler from "./Worker";
import { readFileSync } from "fs";

export const PORT = /**Number.parseInt(process.env.PORT) || */1025;


let noOfConn = 0;
let clientSocket: Socket;
let dataPort: number;
let version: string;

export const file = (filePath: string): string => { 
  return readFileSync(filePath, "utf8");
}


const server = createServer(socket => {
  //socket.pipe(process.stdout);
  //console.log(socket);
  version = JSON.parse(file("./package.json")).version;
  
  socket.write(`\n220  Welcome to the Álviss Raghnall Foundation😏  FTP Server.\nversion: ${version}\n${new Date()}\n`);
  // socket.pipe(process.stdout);
  // process.stdout.write("x");
  // console.log(process.stdout);
  clientSocket = socket;
  
  // socket.on("data", chunk => {
    // console.log(chunk, typeof chunk);
  // });
  
})  /**
 Creates a new instance of the Handler class on every client connection.
*/
.on("connection", async (socket) => {
  server.getConnections((err, count) => {
    if(err) throw err;
    noOfConn = count;
    console.log(noOfConn);
    
  });

  //socket.write("genius!");
  dataPort = PORT + ++noOfConn;
  const handler = new Handler(clientSocket, dataPort);
  
  await handler.start();
    //if(err) throw err;
    //return count;
  //console.log('connected! outside!!')
})
.on("error", () => { 
  throw new Error("Could not create server.") 
  process.exit(1);
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