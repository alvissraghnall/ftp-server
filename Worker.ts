import { Socket } from "net";

export default class Handler {
  constructor(private clientSock: Socket, readonly dataPort: number){
    
  }
}