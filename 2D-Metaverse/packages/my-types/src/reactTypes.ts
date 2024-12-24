import z from "zod";
import { addElementSchema, createAvatarSchema, createElementSchema, createMapSchema, createSpaceSchema, signinSchema, signupSchema, updateElementSchema, updateMetadataSchema } from "./nodeTypes";

export type SignupParams = z.infer < typeof signupSchema>;

export type SigninParams = z.infer< typeof signinSchema>;

export type UpdateMetadataParams = z.infer < typeof updateMetadataSchema >

export type CreateSpaceParams = z.infer < typeof createSpaceSchema >

export type CreateElementParams = z.infer < typeof createElementSchema >

export type AddElementParams = z.infer < typeof addElementSchema >

export type UpdateElementParams = z.infer < typeof updateElementSchema >

export type CreateAvatarParams = z.infer < typeof createAvatarSchema >

export type CreateMapParams = z.infer < typeof createMapSchema >
