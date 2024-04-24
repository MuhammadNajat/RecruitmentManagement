"use client";

import { updateUserData } from "@/app/lib/data/users/mutations/updateUserPassword";
import { generatePassword } from "@/app/lib/helpers/randomPasswordGenerator";
import * as bcrypt from "bcrypt";

export default function UpdatePassword({ id }: { id: string }) {
    const trigerUpdte = async function () {
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserData(id, hashedPassword);
    };

    console.log(">>> >>> >>> Update Password Clicked");

    return (
        <>
            <button data-tooltip-target="tooltip-dark" data-tooltip-placement="top" className="border border-transparent bg-transparent text-blue-700 hover:text-blue-900"
                onDoubleClick={trigerUpdte}>Reset Password</button>
        </>
    );
}