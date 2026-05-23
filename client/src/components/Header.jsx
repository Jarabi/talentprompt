import HeaderLogo from '../assets/headerLogo.svg'

export default function Header() {
    return (
        <header className='border-b border-[#e5e5e5] bg-card/50 backdrop-blur-sm'>
            <div className='mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-8 sm:px-6 lg:px-8'>
                <img className='h-8' src={HeaderLogo} alt="header logo" />
                <p className='text-muted-foreground'>
                    Generate interview questions tailored to any job role in
                    seconds.
                </p>
            </div>
        </header>
    );
}
