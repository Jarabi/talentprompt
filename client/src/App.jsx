import Header from './components/Header';
import QuestionGenerator from './components/QuestionGenerator'
import './App.css';

function App() {
    return (
        <>
            <Header />
            <main className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8'>
                <QuestionGenerator />
            </main>
        </>
    );
}

export default App;
