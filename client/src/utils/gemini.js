/**
 * Fetches 3 interview questions for a given job title from the local backend proxy.
 * @param {string} jobTitle
 * @returns {Promise<string[]>} Array of 3 questions
 */
export const generateInterviewQuestions = async (jobTitle) => {
    // In production, Vite uses import.meta.env.VITE_API_URL
    // In local development, it falls back to your local port
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

    const response = await fetch(`${baseUrl}/api/questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to generate interview questions');
    }

    return data.questions;
};
