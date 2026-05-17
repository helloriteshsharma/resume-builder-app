
export const defaultValues = {
    personal: { fullName: '', designation: '', email: '', phoneNumber: '', location: '', linkedin: '', website: '', github: '', summary: '' },
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ institution: '', degree: '', year: '' }],
    projects: [{ title: '', description: '', github: '', liveDemo: '' }],
    skills: [{ name: '' }],
    certifications: [{ title: '', issuer: '', year: '' }],
    languages: [{ name: '' }],
    interests: [{ name: '' }]
};

// Helper: Transform Frontend -> Backend
export const transformToBackend = (data, selectedTemplate, selectedColor) => {
    const personal = data.personal || {};

    return {
        userId: data.userId,
        title: data.title,

        profileInfo: {
            fullName: personal.fullName || '',
            designation: personal.designation || '',
            summary: personal.summary || ''
        },
        contactInfo: {
            email: personal.email || '',
            phoneNumber: personal.phoneNumber || '',
            location: personal.location || '',
            linkedIn: personal.linkedin || '',
            github: personal.github || '',
            website: personal.website || ''
        },
        workExperiences: (data.experience || []).map(exp => ({
            name: exp.company || '',
            role: exp.role || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || ''
        })),
        educations: (data.education || []).map(edu => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            startDate: '',
            endDate: edu.year || ''
        })),
        projects: (data.projects || []).map(p => ({
            title: p.title || '',
            description: p.description || '',
            github: p.github || '',
            liveDemo: p.liveDemo || ''
        })),
        skills: (data.skills || []).map(s => ({
            name: s.name || '',
            progress: 0
        })),
        certifications: (data.certifications || []).map(c => ({
            title: c.title || '',
            issuer: c.issuer || '',
            year: c.year || ''
        })),
        languages: (data.languages || []).map(l => ({
            name: l.name || '',
            progress: 0
        })),
        // STRICT STRING FILTER to prevent 'Cannot deserialize Object to String' error
        interests: (data.interests || [])
            .map(i => {
                if (typeof i === 'string') return i;
                return i.name || '';
            })
            .filter(i => i && i.trim() !== ''),

        template: {
            theme: selectedTemplate,
            colorPalette: [selectedColor]
        }
    };
};

// Helper: Transform Backend -> Frontend
export const transformToFrontend = (data) => {
    if (!data) return defaultValues;

    let selectedTemplate = null;
    let selectedColor = null;

    if (data.template) {
        if (data.template.theme) selectedTemplate = data.template.theme;
        if (data.template.colorPalette && data.template.colorPalette.length > 0) {
            selectedColor = data.template.colorPalette[0];
        }
    }

    const personal = {
        fullName: data.profileInfo?.fullName || '',
        designation: data.profileInfo?.designation || '',
        summary: data.profileInfo?.summary || '',
        email: data.contactInfo?.email || '',
        phoneNumber: data.contactInfo?.phoneNumber || '',
        location: data.contactInfo?.location || '',
        linkedin: data.contactInfo?.linkedIn || '',
        github: data.contactInfo?.github || '',
        website: data.contactInfo?.website || ''
    };

    const experience = (data.workExperiences || []).map(exp => ({
        company: exp.name || '',
        role: exp.role || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || ''
    }));
    if (experience.length === 0) experience.push(defaultValues.experience[0]);

    const education = (data.educations || []).map(edu => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        year: edu.endDate || edu.year || ''
    }));
    if (education.length === 0) education.push(defaultValues.education[0]);

    const projects = (data.projects || []).map(p => ({
        title: p.title || '',
        description: p.description || '',
        github: p.github || '',
        liveDemo: p.liveDemo || ''
    }));
    if (projects.length === 0) projects.push(defaultValues.projects[0]);

    const skills = (data.skills || []).map(s => ({ name: s.name || '' }));
    if (skills.length === 0) skills.push(defaultValues.skills[0]);

    const certifications = (data.certifications || []).map(c => ({
        title: c.title || '',
        issuer: c.issuer || '',
        year: c.year || ''
    }));
    if (certifications.length === 0) certifications.push(defaultValues.certifications[0]);

    const languages = (data.languages || []).map(l => ({ name: l.name || '' }));
    if (languages.length === 0) languages.push(defaultValues.languages[0]);

    const interests = (data.interests || []).map(i => (typeof i === 'string' ? { name: i } : i));
    if (interests.length === 0) interests.push({ name: '' });

    return {
        ...data,
        personal,
        experience,
        education,
        projects,
        skills,
        certifications,
        languages,
        interests,
        _meta: { selectedTemplate, selectedColor } // Pass extracted meta info back
    };
};
