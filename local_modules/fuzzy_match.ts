const matchSkills = (value, requiredSkill) => {
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      for (const element of value) {
        if (matchSkills(element, requiredSkill)) {
          return true;
        }
      }
    } else {
      for (const key in value) {
        if (matchSkills(value[key], requiredSkill)) {
          return true;
        }
      }
    }
  } else {
    if (typeof value === "string" && value.includes(requiredSkill)) {
      return true;
    }
  }
  return false;
};

export const getRelevantCareerProfiles = (careerProfiles, jobRequirements) => {
  const relevantProfiles = [];

  function searchProfile(profile) {
    for (const key in profile) {
      if (matchSkills(profile[key], jobRequirements.skills_required)) {
        relevantProfiles.push(profile);
        break;
      }
    }
  }

  for (const profile of careerProfiles) {
    searchProfile(profile);
  }

  return relevantProfiles;
};

/*
 * const relevantCareers = getRelevantCareerProfiles(careerProfileArray, jobProfile);
 * console.log(relevantCareers);
 */
