import {
    getPersonById,
    type TeamMember,
} from "../../../../data/content";

function ProjectTeam({ team }: { team: TeamMember[] | undefined }) {
    if (team)
        return (
            <>
                <div className="project-team">
                    {team.map((teamMember, i) => {
                        const person = getPersonById(teamMember.id);
                        if (person) return (
                            <div key={i} className="project-team__member">
                                <div className="project-team__name">{person.name}</div>
                                <div className="project-team__roles">
                                    {teamMember.roles?.map((role, j) => {
                                        if (!teamMember.roles) return;
                                        const isLast = j >= teamMember.roles.length - 1;
                                        return (<span key={`person.name-${j}`}>
                                            <span>{role} </span>
                                            <span>{!isLast && " • "}</span>
                                        </span>

                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
}

export default ProjectTeam;
