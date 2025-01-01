import { WebSocket } from "ws";
import { RoomManager } from "./roomManager";
import { OutgoingMessage } from "./type";
import client from "@repo/db/client";
import {JwtPayload, verify} from "jsonwebtoken";
import { JWT_SECRET } from "./config";


//to generate a random string like DfKp9fE2J
// const getRandomString = (length : number) => {
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

//this === User
export class User {
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;

    constructor (private ws : WebSocket) {
        //this.id = getRandomString(10);
        this.x = 0;
        this.y = 0;
        this.initHandlers();
    }

    initHandlers() {
        
        this.ws.on("message", async (data) => {
            const parsedData = JSON.parse(data.toString());
            console.log("parsedData : ", parsedData)
            switch (parsedData.type) {
                case "join" : 
                    const spaceId = parsedData.payload.spaceId;
                    this.spaceId = spaceId;
                    if (!this.spaceId) {
                        this.ws.close();
                        return;
                    }
                    const jwt = parsedData.payload.token;

                    const token = jwt.split(' ')[1];

                    let userId: string | undefined;

                    try {
                        userId = (verify(token, JWT_SECRET) as JwtPayload).userId;
                    } catch (err) {
                        console.log("Failed to verify :", err)
                        this.ws.close();  // Invalid token
                        return;
                    }  
                    if (!userId){
                        console.log("User id not found")
                        this.ws.close()
                        return;
                    }
                    this.userId = userId;
                    const space = await client.space.findFirst({
                        where : {
                            id : spaceId
                        }
                    })
                    if(!space){
                        this.ws.close();
                        return;
                    }
                    
                    RoomManager.getInstance().addUser(spaceId,this);
                    this.x = Math.floor(Math.random() * space.width);
                    this.y = Math.floor(Math.random() * space.height)

                    this.send({
                        type: "user-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            // Retrieves user IDs for the given spaceId: gets users from the RoomManager, maps them to { id: u.id },
                            // and falls back to an empty array if the room doesn't exist or has no users.
                            users: RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.userId !== this.userId).map((u) => ({id : u.userId})) ?? []
                        }
                    })
                    RoomManager.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!)
                   
                    break;
                
                case "move": 
                    console.log("from here move")
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);
                    
                    if ((xDisplacement == 1 && yDisplacement == 0) || (yDisplacement == 1 && xDisplacement == 0)){
                        this.x = moveX;
                        this.y = moveY;
                        console.log("hihihihihihihi")
                        RoomManager.getInstance().broadcast({
                            type: "move",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                            
                        }, this, this.spaceId!);   
                    }
                    else {
                        console.log("bybeeybeyybey")
                        this.send({
                            type: "movement-rejected",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        })
                    }
            }
        })
    }

    destroy(){
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId
            }
        }, this, this.spaceId!)
        RoomManager.getInstance().removeUser(this, this.spaceId!)
    }

    send (payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }
}

