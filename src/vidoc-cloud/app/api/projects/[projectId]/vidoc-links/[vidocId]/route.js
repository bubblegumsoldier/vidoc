import { NextResponse } from "next/server";
import MembershipRepository from "../../../../../data-access/MembershipRepository";
import ProjectRepository from "../../../../../data-access/ProjectRepository";
import Auth0Authentication from "../../../../../utils/Auth0Authentication";

export const POST = async function getNewVidocLink(req, { params }) {
    const res = new NextResponse();
    const { projectId, vidocId } = params; // Get projectId from the route
  
    const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
      req,
      res
    );

    if (!internalUser) {
      return NextResponse.json(
        { error: "Failed to find authenticated user." },
        res,
        401
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
        res,
        403
      );
    }
  
    return NextResponse.json({
        url: await ProjectRepository.getProjectUploadLink(projectId, vidocId)
    }, res);
  };
  