import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

type CardLinkProps = {
  link: string;
  label: string;
  icone: ReactNode;
};

export default function CardLink({ link, label, icone }: CardLinkProps) {
  return (
    <Link to={link} className="block group">
      <div className="relative overflow-hidden bg-card rounded-xl border border-border shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative p-4">
          
          {/* Icon Container */}
          <div className="mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
              <div className="scale-75 group-hover:scale-90 transition-transform duration-300">
                {icone}
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {label}
            </h3>
            <p className="text-xs text-muted-foreground">
              Clique para acessar
            </p>
          </div>
          
          {/* Arrow Icon */}
          <div className="mt-3 flex justify-end">
            <div className="w-6 h-6 rounded-full bg-muted dark:bg-accent flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
}
