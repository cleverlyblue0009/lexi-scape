import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  isActive = false,
  onClick,
  className = ""
}: FeatureCardProps) => {
  return (
    <Card 
      className={`
        group cursor-pointer transition-all duration-300 hover-lift
        ${isActive ? 'ring-2 ring-primary shadow-glow' : 'hover:shadow-md'}
        ${className}
      `}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`
            p-3 rounded-lg transition-colors duration-300
            ${isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground'
            }
          `}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};