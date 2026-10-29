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
                                    {role}
                                    {!isLast && <span aria-hidden="true"> • </span>}
                                </span>
                            )
                        })}
                    </div>
                </div>
                {
                    person.link && (
                        <ArrowUpRightIcon className="team-member__link" />
                    )
                }
            </>
        )
}

export default TeamMemberInfo;
