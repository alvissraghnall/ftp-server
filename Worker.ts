import type { Socket } from "net";

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
   * Parse client input, from buffer, into valid strings,
   * and pushes handling of individual commands to
   * various handlers availale.
  */
  
  private commander(cmdargs: string) {
    console.log("===========");
    let [cmd, ...args] = cmdargs.split(" ");
    cmd = cmd.toUpperCase();
    this.debugPrintOut(`Command: ${cmd} \n Args: ${typeof args}`);
    switch(cmd){
      case "USER":
        this.handleUserComm(args);
        break;
        
      //case 
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
  
  private handleUserComm(args: string | string[]) {
    
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

}