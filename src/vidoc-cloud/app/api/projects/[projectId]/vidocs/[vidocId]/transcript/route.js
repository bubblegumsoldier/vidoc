import { NextResponse } from "next/server";
import MembershipRepository from "../../../../../../data-access/MembershipRepository";
import Auth0Authentication from "../../../../../../utils/Auth0Authentication";
import { VoiceTranscribe } from "../../../../../../data-access/VoiceTranscribe";

export const maxDuration = 600; // This function can run for a maximum of 600 seconds

export const GET = async function getNewVidocLink(req, { params }) {
    const res = new NextResponse();
    const { projectId, vidocId } = params; // Get projectId from the route

    const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
        req,
        res
    );

    if (!internalUser) {
        return NextResponse.json(
            { error: "Failed to find authenticated user." },
            {
                status: 401,
            }
        );
    }

    // Check if the current user is member of the project
    if (
        !(await MembershipRepository.isUserMemberOfProject(
            internalUser.id,
            projectId
        ))
    ) {
        return NextResponse.json(
            { error: "Only the member of project can upload a video." },
            {
                status: 403,
            }
        );
    }

    // Get transcript of vidoc
    try {
        const result = await VoiceTranscribe.getTranscript(projectId, vidocId);
        return NextResponse.json(
            {
                transcript: result,
            },
            res
        );
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to get transcript." },
            {
                status: 500,
            }
        );
    }

};
