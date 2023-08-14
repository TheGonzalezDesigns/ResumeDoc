enum ContentType {
    ProfessionalSummary = 0,
    JobApplicationCoverLetter = 1,
    TechnicalSkillList = 2,
    CareerQuery = 3
}

export function validateContentType(contentType: ContentType): string {
    switch (contentType) {
        case ContentType.ProfessionalSummary:
            return 'Professional Summary';
        case ContentType.JobApplicationCoverLetter:
            return 'Job Application Cover Letter';
        case ContentType.TechnicalSkillList:
            return 'Technical Skill List';
        case ContentType.CareerQuery:
            return 'Career query response';
        default:
            throw 'No contentType selected.';
    }
}
