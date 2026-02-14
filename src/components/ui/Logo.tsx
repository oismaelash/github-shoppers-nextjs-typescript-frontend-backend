export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                fill="currentColor"
            />
        </svg>
    );
}
