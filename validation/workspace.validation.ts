import { z } from "zod";

const nameSchema = z.string().trim().min(1, 'Name is required').max(255);
const descriptionSchema = z.string().trim().optional();

export const createWorkspaceSchema = z.object({
    name: nameSchema,
    description: descriptionSchema
})

export const updateWorkspaceSchema = z.object({
    name: nameSchema,
    description: descriptionSchema
})