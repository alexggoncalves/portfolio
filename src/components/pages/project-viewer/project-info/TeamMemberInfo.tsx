import {
    type Person,
} from "../../../../data/content";
import { ArrowUpRightIcon } from "../../../ui/Icons";

type TeamMemberInfoProps = {
    person: Person;
    roles?: string[];
}

function TeamMemberInfo({ person, roles }: TeamMemberInfoProps) {
    if (person)
        return (
            <>
                <div className="team-member__info">
                    <div className="team-member__name">{person.name}</div>
                    <div className="team-member__roles">
                        {roles?.map((role, i) => {
                            if (!roles) return;
                            const isLast = i >= roles.length - 1;
                            return (
                                <span key={`${person.name}-role${i}`}>
                                    <span aria-hidden="true">{role} </span>
                                    <span aria-hidden="true">{!isLast && " • "}</span>
                                </span>
                            )
                        })}
                    </div>
                </div>
                {
                    person.link && <a
                        href={person.link}
                        className="team-member__link"
                    >
                        <ArrowUpRightIcon />
                    </a>
                }
            </>
        )
}

export default TeamMemberInfo;
