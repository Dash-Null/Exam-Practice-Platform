import scienceData from '../../CLS_10_science_data.json';

// Helper to normalized subject names
const normalizeSubject = (subject) => {
    if (!subject) return 'Biology'; // Default
    const map = {
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology'
    };
    return map[subject.toLowerCase()] || 'Biology';
};

export const getQuestions = (subject) => {
    const subjectName = normalizeSubject(subject);
    const section = scienceData.sections.find(s => s.section_name === subjectName);
    return section ? section.marks_groups : [];
};

export const getMCQs = (subject) => {
    const groups = getQuestions(subject);
    const mcqGroup = groups.find(g => g.group === '1-mark' || g.group === 'MCQ');
    return mcqGroup ? mcqGroup.questions : [];
};

export const getAllMCQs = () => {
    let allQuestions = [];
    const subjects = ['Physics', 'Chemistry', 'Biology'];
    subjects.forEach(sub => {
        const questions = getMCQs(sub);
        // Tag them with subject for display if needed
        const taggedQuestions = questions.map(q => ({ ...q, subject: sub }));
        allQuestions = [...allQuestions, ...taggedQuestions];
    });
    return allQuestions;
};

export const getAllSubjects = () => {
    return scienceData.sections.map(s => s.section_name);
};
