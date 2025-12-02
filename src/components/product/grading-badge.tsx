import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradingBadgeProps {
    company: 'PSA' | 'BGS' | 'CGC' | 'SGC' | 'Raw';
    grade?: string;
    className?: string;
}

export function GradingBadge({ company, grade, className }: GradingBadgeProps) {
    if (company === 'Raw') return null;

    const getColors = (company: string) => {
        switch (company) {
            case 'PSA':
                return 'bg-red-600 hover:bg-red-700 text-white border-red-700';
            case 'BGS':
                return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700';
            case 'SGC':
                return 'bg-black hover:bg-gray-900 text-white border-gray-800';
            case 'CGC':
                return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600';
            default:
                return 'bg-gray-600 hover:bg-gray-700 text-white';
        }
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Badge
                variant="outline"
                className={cn(
                    "px-3 py-1 text-sm font-bold border-2 shadow-sm",
                    getColors(company)
                )}
            >
                {company} {grade}
            </Badge>
            <div className="flex items-center text-xs text-green-600 font-medium">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Auth Verified
            </div>
        </div>
    );
}
