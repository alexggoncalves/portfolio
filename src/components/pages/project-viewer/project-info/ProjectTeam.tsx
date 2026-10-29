import { Fragment } from "react/jsx-runtime";
import { getPersonById, type TeamMember } from "../../../../data/content";
import TeamMemberInfo from "./TeamMemberInfo";


function ProjectTeam({ team }: { team: TeamMember[] | undefined }) {
    if (team)
        return (
            <>
                <div className="project-team">
                    {team.map((teamMember, i) => {
                        const person = getPersonById(teamMember.id);
                        const isLast = i >= team.length - 1

                        if (person) return <Fragment key={teamMember.id}>
                            {person?.link ?
                                <a
                                    href={person.link}
                                    target="_blank"
                                    key={i}
                                    className="team-member"
                                >
                                    <TeamMemberInfo person={person} roles={teamMember.roles} />
                                </a>
                                :
                                <div key={i} className="team-member">
                                    <TeamMemberInfo person={person} roles={teamMember.roles} />
                                </div>
                            }
                            {!isLast && <span className="list-separator" aria-hidden={true} />}
                        </Fragment>
                    })}
                </div>
            </>
        );
}

export default ProjectTeam;
