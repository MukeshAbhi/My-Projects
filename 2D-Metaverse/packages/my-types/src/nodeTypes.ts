import z from 'zod';

export const signupSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    type: z.enum(["user", "admin"])
})

export const signinSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6)
})

export const updateMetadataSchema = z.object({
    avatarId: z.string()
})

export const createSpaceSchema = z.object({
    name: z.string(),
    // to sanitize the dimesnsions variable to have only like 1000 x 1000 values
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId : z.string()
})

export const createElementSchema = z.object({
    imageUrl: z.string().url(),
    width: z.number(),
    height: z.number(),
    static : z.boolean()
})

export const addElementSchema = z.object({
    elementId : z.string(),
    spaceId : z.string(),
    x: z.number(),
    y: z.number()
})

export const updateElementSchema = z.object({
    imageUrl : z.string().url()
})

export const createAvatarSchema = z.object({
    imageUrl : z.string().url(),
    name : z.string()
})

export const createMapSchema = z.object({
    thumbnail: z.string().url(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements : z.array(z.object({
            elementId: z.string(),
            x: z.number(),
            y: z.number()
        }))
})

