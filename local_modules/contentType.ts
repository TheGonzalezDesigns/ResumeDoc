enum ContentType {
    ProfessionalSummary = 0,
    JobApplicationCoverLetter = 1,
    TechnicalSkillList = 2
}

export function validateContentType(contentType: ContentType): string {
    switch (contentType) {
        case ContentType.ProfessionalSummary:
            return 'Professional Summary';
        case ContentType.JobApplicationCoverLetter:
            return 'Job Application Cover Letter';
        case ContentType.TechnicalSkillList:
            return 'Technical Skill List';
        default:
            return 'No contentType selected.';
    }
}
