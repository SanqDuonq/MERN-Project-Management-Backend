import mongoose from "mongoose";
import connectMongoDB from "../database/connect-mongo";
import Role from "../model/role-permission.model";
import { RolePermission } from "../util/role-permission";

const seedRoles = async () => {
    console.log('Seeding roles stated...');
    try {
        await connectMongoDB();
        const session = await mongoose.startSession();
        session.startTransaction();
        console.log('Clearing existing roles...')
        await Role.deleteMany({}, {session})

        for (const roleName in RolePermission) {
            const role = roleName as keyof typeof RolePermission;
            const permission = RolePermission[role]; 

            const existRole = await Role.findOne({name: role}).session(session);
            if (!existRole) {
                const newRole = new Role({
                    name: role,
                    permissions: permission
                })
                await newRole.save({session})
                console.log(`Role ${role} added with permissions.`);
            }
            else {
                console.log(`Role ${role} already exists.`);
            }
        }
        await session.commitTransaction();
        console.log("Transaction committed.");

        session.endSession();
        console.log("Session ended.");
    
        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Error during seeding:", error);
    }
}

seedRoles().catch((error) =>
    console.error("Error running seed script:", error)
);