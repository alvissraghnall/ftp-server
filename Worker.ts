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
  private userName!: string;
  
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
    cmd = cmd.trim().toUpperCase();
    let mainArg = args[0].split("\\")[0].replace(/(\n|\r)+$/, '').toLowerCase();
    //args = args.join(" ");
    this.debugPrintOut(`Command: ${cmd} \n Args: ${typeof args} ${args.length}`);
    switch(cmd){
      case "USER":
        //console.log("user case");
        args.length === 0 ? this.handleUser() : this.handleUser(mainArg);
        break;
      case "PASS":
        args.length === 0 ? this.handlePass() : this.handlePass(mainArg);
        break;
        
      //case 
      
      default:
        this.sendToClient("Please enter a valid FTP command. \n");
        //this.handleUser(args);
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
  private async handleUser(mainArg?: string): Promise<void> {
    if(this.userLoggedInStatus === userStatus.LOGGEDIN){
      this.sendToClient("530 User is already logged in.\n");
    } else {
      let username: string;
      console.log(mainArg);
      if(mainArg){
        username = mainArg;
        console.log("\n un: %s", username);
        this.checkValidLogin(username);
      } else {
        this.sendToClient(`Name (alvissraghnall.io:yourlogin): `);
        this.clientSock.on("data", (chunk: Buffer) => {
          username = chunk.toString().trim().toLowerCase();
          this.checkValidLogin(username);
        })
      }
      
    }
  }
  
  
  /*////********
  
  !!!!!!  HELPER METHODS START  !!!!!
  
  *****//////
  
  /**
  Check if inputted username is valid (present amongst the list of valid logins).
  Used by this.handleUser(args?: string)
  */
  private checkValidLogin(username: string) {
    if (this.validLogins().find(user => user.name.toLowerCase() === username)) {
      console.log(username)
      this.userLoggedInStatus = userStatus.ENTEREDUSERNAME;
      this.userName = username;
      this.sendToClient(`331 User name valid. Password required for authentication.\n`);
    } else {
      this.sendToClient("530 User name invalid\n");
    }
  }
  
  
  
  
    /*////********
    
    !!!!!!  HELPER METHODS END  !!!!!
    
    *****//////
  private checkValidPass(pass: string) {
    
  }
    
    
  /** 
   * First, checks if user status is ‘ENTEREDUSERNAME’, else throws error (telling client to first login[using ‘user’ command.])
   * Then, ...
   
  */
  private handlePass(arg?: string): void {
    if(this.userLoggedInStatus === userStatus.LOGGEDIN){
      this.sendToClient("530 User already logged in");
    } else if(this.userLoggedInStatus === userStatus.NOTLOGGEDIN) {
      this.sendToClient("User not logged in.");
    } else if(this.userLoggedInStatus === userStatus.ENTEREDUSERNAME) {
      let password: string;
      if(arg) {
        password = arg;
        
      } else {
        this.sendToClient(`331 Password required for ${this.userName }:  `);
        this.clientSock.on("data", (chunk: Buffer) => {
          password = chunk.toString().trim().toLowerCase();
        })
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