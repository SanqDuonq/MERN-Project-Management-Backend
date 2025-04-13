import mongoose from "mongoose";
import connectMongoDB from "../database/connect-mongo";
import Role from "../model/role-permission.model";
import { RolePermission } from "../util/role-permission";

const seedRoles = async () => {
    console.log('Seeding roles started...');
    try {
        await connectMongoDB();
        const session = await mongoose.startSession();
        session.startTransaction();
        for (const roleName in RolePermission) {
            const role = roleName as keyof typeof RolePermission;
            const permissions = RolePermission[role];

            const existingRole = await Role.findOne({ name: role }).session(session);
            
            if (!existingRole) {
                const newRole = new Role({
                    name: role,
                    permissions: permissions
                });
                await newRole.save({ session });
                console.log(`Role ${role} added.`);
            } else {
                console.log(`Role ${role} already exists. Skipped.`);
            }
        }

        await session.commitTransaction();
        session.endSession();
        console.log("Seeding completed.");
    } catch (error) {
        console.error("Error during seeding:", error);
    }
};

seedRoles().catch((error) =>
    console.error("Error running seed script:", error)
);