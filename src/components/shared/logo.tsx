import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean; // true cuando va sobre foto/fondo oscuro
}

export function Logo({ className, showText = true, light = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect
          width="36"
          height="36"
          rx="10"
          fill={light ? "#FAF7F2" : "#1E3A5F"}
        />
        <path
          d="M11 26V10H17.5C20.5376 10 23 12.4624 23 15.5C23 18.5376 20.5376 21 17.5 21H14V26H11Z"
          fill={light ? "#1E3A5F" : "#FAF7F2"}
        />
        <circle cx="17.5" cy="15.5" r="2" fill="#C2724A" />
      </svg>
      {showText && (
        <span
          className={cn(
            "text-xl font-semibold tracking-tight",
            light ? "text-white" : "text-foreground"
          )}
        >
          Park
          <span
            className={cn(
              "font-display italic font-medium",
              light ? "text-white" : "text-lime"
            )}
          >
            Away
          </span>
        </span>
      )}
    </div>
  );
}
