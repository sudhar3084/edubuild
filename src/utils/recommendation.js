export const getRecommendations = (projects, budget, classLevel, subject) => {
    // Simple scoring algorithm
    const scoredProjects = projects.map(p => {
        let score = 0;
        // Budget Check: High score if well within budget
        if (p.budget <= budget) score += 10;
        if (p.budget <= budget / 2) score += 5; // Bonus for very cheap

        // Class Level Match
        if (p.classLevel === classLevel) score += 10;

        // Subject Match
        if (p.subject === subject) score += 10;

        // Rating Weight
        score += (p.rating || 0);

        return { ...p, score };
    });

    // Sort by score descending and take top 3
    return scoredProjects.sort((a, b) => b.score - a.score).slice(0, 3);
};
