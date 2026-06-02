import {
    getPersonById,
    type TeamMember,
} from "../general/content";

function ProjectTeam({ team }: { team: TeamMember[] | undefined }) {
    if (team)
        return (
            <>
                <h3>TEAM:</h3>
                <div className="project-window__team-container">
                    {team.map((teamMember, i) => {
                        const person = getPersonById(teamMember.id);
                        if (person)
                            return (
                                <div key={i}>
                                    {person.name.replace(" ", "\n")}
                                </div>
                            );
                    })}
                </div>
            </>
        );
}

export default ProjectTeam;
