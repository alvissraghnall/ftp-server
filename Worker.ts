import type { Socket } from "net";
import { file } from "./Server";
import type { validLogins } from "./types";

enum userStatus {
  NOTLOGGEDIN, ENTEREDUSERNAME, LOGGEDIN, ANONYMOUS
}

export default class Handler {
  private trfMode: "active" | "passive";
  private endCommands: boolean = false;
  private userLoggedInStatus: userStatus = userStatus.NOTLOGGEDIN;
  private debugMode = true;
  
  constructor(private clientSock: Socket, readonly dataPort: number) {
    this.trfMode = "passive";
  }
  
  /**
   * called for every client console input. Receives 
   * client commands (as well as args), and calls 
   * commander method when ${endCommands} remains untrue, otherwise, it emits a close event. (????)
   * 
  */
  private newData(): void {
    //if (!this.endCommands) {
    this.clientSock.on("data", chunk => {
      console.log(chunk, chunk.toString(), this.dataPort);
      if(!this.endCommands){
        this.commander(chunk.toString());
      }
    });
    //}
    //console.log(this.clientSock);
    
  }
  
  /**
   * Parse client input, from buffer, into valid strings, and pushes handling of individual commands to
   * various handlers availale.
  */
  
  private commander(cmdargs: string) {
    console.log("===========");
    let [cmd, ...args] = cmdargs.split(" ");
    cmd = cmd.toUpperCase();
    //args = args.join(" ");
    this.debugPrintOut(`Command: ${cmd} \n Args: ${typeof args}`);
    switch(cmd){
      case "USER":
        console.log("user case");
        this.handleUser(args);
        //break;
        
      //case 
      
      default:
        this.handleUser(args);
      //  break;
    }
  }
  /**
  For printing out information in debug mode. 
  */
  private debugPrintOut(msg: string): void {
    if(this.debugMode) {
      console.log(`Client Connection: ${this.dataPort - 1025} \n ${msg}`)
    }
  }
  
  /**
   * Method for handling user login upon connection to the ÁR ftp server. 
   * Accepts array of string arguments passed via the command line, as arguments.
   * 
  */
  private handleUser(args: string[]): void {
    if(this.userLoggedInStatus === userStatus.LOGGEDIN){
      this.sendToClient("530 User is already logged in.");
    } else {
      console.log(args);
      let username: string;
      this.sendToClient(`Name (alvissraghnall.io:yourlogin): `);
      this.clientSock.on("data", (chunk: Buffer) => {
        username = chunk.toString();
      });
      if(this.validLogins().find(username => username.toLowerCase())){
        this.userLoggedInStatus = userStatus.ENTEREDUSERNAME;
        this.sendToClient(`331 User name valid. Password required for authentication.`);
      }
    }
  }
  
  /**
  
  */
  async start() {
    try {
      this.newData();
    } catch(err: unknown){
      const error = <Error> err;
      console.error(error);
      process.exit(1);
    }
  }
  
  private sendToClient(msg: string): void {
    this.clientSock.write(msg);
  }
  
  private validLogins(): validLogins {
    const valLogins = JSON.parse(file("./validDetails.json"));
    console.log(valLogins);
    return valLogins;
  }

}