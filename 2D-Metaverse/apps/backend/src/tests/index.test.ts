import { describe, test, expect, beforeAll} from 'vitest';
import request from 'supertest';
import { app }  from '../index';

const BACKEND_URL = "http://localhost:3000"

describe("Authentication", () => {
    test("User is able to sign up ONLY Once", async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(200);

        const updatedResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(updatedResponse.statusCode).toBe(400);

    });

    test("Signup request fails if username is empty", async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(400);
    });

    test("Signin succeeds if the username and password are correct ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username,
            password
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("Signin fails if the username and password is incorrect ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username : "WrongUsername",
            password
        });

        expect(response.statusCode).toBe(403);
    });
    // add more auth tests for robust backend
});

describe("User metadata data endpoints", () => {

    let token = '';
    let avatarId = '';

    beforeAll(async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        });

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username,
            password
        })
        token = response.body.token;

        const avataResponse = await request(app).post(`${BACKEND_URL}/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }) 

        avatarId = avataResponse.body.avatarId
    })

    test("User cant update their metadata", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/user/metadata`).send({
            avatarId : "123456789789"
        }).set({"authorization": `Bearer ${token}`})
        expect(response.statusCode).toBe(400);
    })

    test("User can update their metadata", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/user/metadata`).send({
            avatarId 
        }).set({"authorization": `Bearer ${token}`})
        expect(response.statusCode).toBe(200);
    })
    
    test("User fis not ablr to update there meta data if not provide auth header", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/user/metadata`).send({
            avatarId
        });
        expect(response.statusCode).toBe(403);
    })
});

describe("User avatar information", () => {
    let token = '';
    let avatarId = '';
    let userId = '';

    beforeAll(async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const signupResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        });

        userId = signupResponse.body.userId;

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username,
            password
        })
        token = response.body.token;

        const avataResponse = await request(app).post(`${BACKEND_URL}/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }) 

        avatarId = avataResponse.body.avatarId
    })

    test("Get back avatar information for a user", async () => {
        const response = await request(app).get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`).set({
            "authorization" :`Bearer ${token}`
        });

        expect(response.body.avatars.length).toBe(1);
        expect(response.body.avatars[0].userId).toBe(userId);
    });

    test("Available avatars lists the reacently created avatars", async () => {
        const response = await request(app).get(`${BACKEND_URL}/api/v1/avatars`).set({
            "authorization" :`Bearer ${token}`
        });

        expect(response.body.avatars.length).not.toBe(0);

        const currentAvatar = response.body.avatars.find((x: { id: string; }) => x.id === avatarId);
        expect(currentAvatar).toBeDefined();

    })



});

describe("Space information", () => {
    let mapId = "";
    let element1Id = "";
    let element2Id = "";
    let adminToken = "";
    let adminId = "";
    let userId = "";
    let userToken = "";

    beforeAll(async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const signupResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        });

        adminId = signupResponse.body.userId;

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username,
            password
        })
        adminToken = response.body.token;

        const element1 = await request(app).post(`${BACKEND_URL}/api/v1/admin/element`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }).set({
            "authorization" : `Bearer ${adminToken}`
        });

        const element2 = await request(app).post(`${BACKEND_URL}/api/v1/admin/element`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }).set({
            "authorization" : `Bearer ${adminToken}`
        });

        element1Id = element1.body.elementId;
        element2Id = element2.body.elementId;

        const map = await request(app).post(`${BACKEND_URL}/api/v1/admin/map`).send({
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: element1,
                    x: 20,
                    y: 20
                }, {
                  elementId: element2Id,
                    x: 18,
                    y: 20
                }, {
                  elementId: element1Id,
                    x: 19,
                    y: 20
                }, {
                  elementId: element2Id,
                    x: 19,
                    y: 20
                }
            ]
         }).set({
            "authorization" : `Bearer ${adminToken}`
        });
        mapId = map.body.mapId;

        const userSignupResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username: `${username}-user`,
            password,
            type: "user"
        });

        userId = userSignupResponse.body.userId;

        const userSignInResponse = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username: `${username}-user`,
            password
        })

        userToken = userSignInResponse.body.token;

         

    })

    test("User is able to create a Sapce", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
       }).set({"authorization" : `Bearer ${userToken}`});

       expect(response.body.spaceId).toBeDefined();
    });

    test("User is able to create a space without mapId(empty space)", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${userToken}`});
        expect(response.body.spaceId).toBeDefined();
    })

    test("User is NOT able to create a space without mapId(empty space) AND dimensions", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
            "name" : "Test"
        }).set({"authorization" : `Bearer ${userToken}`});
        expect(response.statusCode).toBe(400);
    })

    test("User is NOT able to delete a space that does not exisst", async () => {
        const response = await request(app).delete(`${BACKEND_URL}/api/v1/space/randomeSpaceId`).set({"authorization" : `Bearer ${userToken}`});
        expect(response.statusCode).toBe(400);
    })

    test("User is able to delete a space that does exisst", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${userToken}`});

        const deleteResponse = await request(app).delete(`${BACKEND_URL}/api/v1/space/${response.body.spaceId}`).set({"authorization" : `Bearer ${userToken}`});

        expect(deleteResponse.statusCode).toBe(200);
    })

    test("user should not able to delete a space created by another user", async () => {
        const response = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${userToken}`});

        const deleteResponse = await request(app).delete(`${BACKEND_URL}/api/v1/space/${response.body.spaceId}`).set({"authorization" : `Bearer ${adminToken}`});

        expect(deleteResponse.statusCode).toBe(400);
    })

    test("Admin has no spaces initially", async () => {
        const response = await request(app).get(`${BACKEND_URL}/api/v1/space/all`).set({"authorization" : `Bearer ${adminToken}`});
        expect(response.body.spaces.length).toBe(0);
    })

    test("Admin has a spaces initially", async () => {
        const spaceCreatedResponse = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${adminToken}`});

        const response = await request(app).get(`${BACKEND_URL}/api/v1/space/all`).set({"authorization" : `Bearer ${adminToken}`});
        const filteredSpace = response.body.spaces.find((x:{x: String,id: String}) => x.id == spaceCreatedResponse.body.spaceId );
        expect(response.body.spaces.length).toBe(1);
        expect(filteredSpace).toBeDefined();
    })
    
})

describe("Arena endPoins", () => {
        let mapId = "";
        let element1Id = "";
        let element2Id = "";
        let adminToken = "";
        let adminId = "";
        let userId = "";
        let userToken = "";
        let spaceId = "";
    
        beforeAll(async () => {
            const username = `abhi-${Math.random()}`;
            const password = '123456';
    
            const signupResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
                username,
                password,
                type: "admin"
            });
    
            adminId = signupResponse.body.userId;
    
            const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
                username,
                password
            })
            adminToken = response.body.token;
    
            const element1 = await request(app).post(`${BACKEND_URL}/api/v1/admin/element`).send({
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
                "static": true
            }).set({
                "authorization" : `Bearer ${adminToken}`
            });
    
            const element2 = await request(app).post(`${BACKEND_URL}/api/v1/admin/element`).send({
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
                "static": true
            }).set({
                "authorization" : `Bearer ${adminToken}`
            });
    
            element1Id = element1.body.elementId;
            element2Id = element2.body.elementId;
    
            const map = await request(app).post(`${BACKEND_URL}/api/v1/admin/map`).send({
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 18,
                        y: 20
                    }, {
                      elementId: element1Id,
                        x: 19,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }
                ]
             }).set({
                "authorization" : `Bearer ${adminToken}`
            });
            mapId = map.body.mapId;
    
            const userSignupResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
                username: `${username}-user`,
                password,
                type: "user"
            });
    
            userId = userSignupResponse.body.userId;
    
            const userSignInResponse = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
                username: `${username}-user`,
                password
            })
    
            userToken = userSignInResponse.body.token;

            const space = await request(app).post(`${BACKEND_URL}/api/v1/space`).send({
                "name" : "Test",
                "dimensions" : "100x200",
                "mapId" : "map1"
            }).set({"authorization": `Bearer ${userToken}`});

            spaceId = space.body.spaceId;
    
        })

        test("Incorrect space Id return a 400", async () => {
            const response = await request(app).get(`${BACKEND_URL}/api/v1/space/123dmskkds22`).set({"authorization": `Bearer ${userToken}`});
            expect(response.statusCode).toBe(400);
        })

        test("correct sopaceId returns all elements", async () => {
            const response = await request(app).get(`${BACKEND_URL}/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});
            expect(response.body.dimensions).toBe("100x200");
            expect(response.body.elements.length).toBe(4);
        })

        test("Delete an element ", async () => {
            const response = await request(app).get(`${BACKEND_URL}/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});

            await request(app).delete(`${BACKEND_URL}/api/v1/space/element`).send({
                spaceId: spaceId,
                elementId : response.body.elements[0].id
            })

            const newResponse = await request(app).get(`${BACKEND_URL}/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});

            expect(newResponse.body.elements.length).toBe(3);
        })

        test("Addind an element works as expected", async () => {
            await request(app).post(`${BACKEND_URL}/api/v1/space/element`).send({
                "elementId" : element1Id,
                "spaceId" : spaceId,
                "x" : 50,
                "y" : 20
            }).set({"authorization": `Bearer ${userToken}`});

            const newResponse = await request(app).get(`${BACKEND_URL}/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});

            expect(newResponse.body.elements.length).toBe(4);
        })

        test("Addind an element fails if element lies outside the dimensions", async () => {
            const response = await request(app).post(`${BACKEND_URL}/api/v1/space/element`).send({
                "elementId" : element1Id,
                "spaceId" : spaceId,
                "x" : 3000,
                "y" : 2000
            }).set({"authorization": `Bearer ${userToken}`});

            expect(response.statusCode).toBe(400)
        })
})