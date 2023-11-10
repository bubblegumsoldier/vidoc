import {
    withApiAuthRequired,
    getSession,
    getAccessToken,
    withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserRepository from "../data-access/UserRepository";
import TokenValidation from "../utils/TokenValidation";

export default withPageAuthRequired(async () => {
    const session = await getSession();
    headers();
    if (!session || !session.user) {
        return <>Failed to find logged in user</>;
    }

    const auth0Id = session.user.sub;
    const user = await UserRepository.getUserByAuth0Id(
        auth0Id,
        session.user.email,
        {},
        true,
        session
    );
    const newlyGeneratedAccessToken =
        await TokenValidation.generateNewTokenForUser(user.id);

    if (!newlyGeneratedAccessToken) {
        return <>Failed to generate new token for user</>;
    }
    return redirect(
        `http://localhost:7989/auth/callback?token=${encodeURIComponent(
            newlyGeneratedAccessToken.token
        )}`
    );
}, {
    returnTo: "/extension-auth",
});
