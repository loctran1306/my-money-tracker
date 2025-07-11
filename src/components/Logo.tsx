import { Wallet } from "lucide-react";

interface LogoProps {
    className?: string;
    showText?: boolean;
    onClick?: () => void;
}

export default function Logo({ className = "", showText = true, onClick }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`} onClick={onClick}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-1.5">
                <Wallet className="w-5 h-5 text-white" />
            </div>
            {showText && <span className="font-semibold text-gray-900 dark:text-white"> Tracker</span>}
        </div>
    );
}

