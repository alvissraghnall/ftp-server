# A Simple FTP Server Application built with NodeJS

### Installation & Running:

- git clone git@github.com:alvissraghnall/ftp-server.git
- cd ftp-server
- npm install
- npm run launch

### Making Connections To FTP Server

Using ___ncat___ :

Run:
`nc localhost 1025`

_Thereafter, input the `User` command if you desire to log in, or `` if you prefer an anonymous connection._


### Available Commands :

- USER <args>: Server asks for user authentication details. If   `args`   are passed, it ‘extrapolates’ User login from command.


- PASS <args>: