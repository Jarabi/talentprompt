import { useState } from 'react';
import { generateInterviewQuestions } from '../utils/gemini';

export default function QuestionGenerator() {
    const [jobTitle, setJobTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchedTitle, setSearchedTitle] = useState(''); // Tracks the submitted title for the results heading

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jobTitle.trim()) return;

        setIsLoading(true);
        setError('');
        setQuestions([]);
        setSearchedTitle(jobTitle.trim());

        try {
            const data = await generateInterviewQuestions(jobTitle);
            setQuestions(data);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormClear = () => {
        setJobTitle('');
        setQuestions([]);
        setSearchedTitle('');
    };

    return (
        <div className='w-full mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                AI Interview Question Generator
            </h2>
            <p className='text-gray-500 text-sm mb-6'>
                Enter a job title below to instantly generate three thoughtful,
                role-specific interview questions.
            </p>

            <form onSubmit={handleSubmit} className='w-full'>
                <div className='w-full'>
                    <label
                        htmlFor='jobTitle'
                        className='block text-sm font-medium text-gray-700 mb-1'
                    >
                        Job Title
                    </label>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-3 w-full'>
                        <div className='relative flex items-center w-full'>
                            <input
                                type='text'
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className='w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none'
                                placeholder='e.g., Customer Success Manager'
                                disabled={isLoading}
                            />

                            {jobTitle && !isLoading && (
                                <button
                                    type='button'
                                    onClick={handleFormClear}
                                    className='absolute right-3 text-gray-400 hover:text-gray-600 transition'
                                >
                                    <svg
                                        className='h-4 w-4'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth='2.5'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M6 18L18 6M6 6l12 12'
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            type='submit'
                            disabled={isLoading || !jobTitle.trim()}
                            className='flex-none bg-neutral-800 hover:bg-neutral-600 text-white font-medium py-2.5 px-4 rounded-lg transition dynamic-button disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                        >
                            {isLoading ? (
                                <>
                                    {/* Spinner Icon */}
                                    <svg
                                        className='animate-spin h-5 w-5 text-white'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        />
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        />
                                    </svg>
                                    <span>Generating Questions...</span>
                                </>
                            ) : (
                                <span>Generate Questions</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Error State */}
            {error && (
                <div className='mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-700'>
                    <p className='font-semibold'>Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Loading State Skeletons */}
            {isLoading && (
                <div className='mt-8 space-y-4 animate-pulse'>
                    <div className='h-6 bg-gray-200 rounded w-2/3 mb-6'></div>
                    <div className='space-y-4'>
                        {[1, 2, 3].map((n) => (
                            <div key={n} className='p-5 bg-gray-50 rounded-lg border border-gray-100 flex items-start space-x-3'>
                                <div className='shrink-0 w-6 h-6 rounded-full bg-gray-200 mt-0.5'></div>
                                <div className='flex-1 space-y-2 py-1'>
                                    <div className='h-4 bg-gray-200 rounded w-full'></div>
                                    <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State / Initial Load */}
            {questions.length === 0 && !isLoading && !error && (
                <div className='mt-8 p-8 border border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50'>
                    <div className='mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400'>
                        <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                        </svg>
                    </div>
                    <h3 className='text-base font-semibold text-gray-800 mb-1'>No Questions Yet</h3>
                    <p className='text-sm text-gray-500 max-w-sm mx-auto'>
                        Search for a job title above to get started with interview questions.
                    </p>
                </div>
            )}

            {/* Results State */}
            {questions.length > 0 && !isLoading && (
                <div className='mt-8 space-y-4 animation-fade-in'>
                    <h3 className='text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2 flex-wrap'>
                        <span>Suggested Questions for</span>
                        <span className='rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-700 border border-gray-200'>
                            {searchedTitle}
                        </span>
                    </h3>
                    <ol className='space-y-4'>
                        {questions.map((question, index) => (
                            <li
                                key={index}
                                className='p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start space-x-3 hover:border-gray-300 transition-colors duration-200'
                            >
                                <span className='shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-bold mt-0.5 text-gray-700'>
                                    {index + 1}
                                </span>
                                <p className='text-gray-700 leading-relaxed'>
                                    {question}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}