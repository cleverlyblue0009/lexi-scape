interface MarqueeProps {
  text: string;
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export const Marquee = ({ 
  text, 
  speed = "normal", 
  className = "" 
}: MarqueeProps) => {
  const speedClass = {
    slow: "animate-[marquee_30s_linear_infinite]",
    normal: "animate-[marquee_20s_linear_infinite]", 
    fast: "animate-[marquee_10s_linear_infinite]"
  }[speed];

  return (
    <div className={`overflow-hidden bg-gradient-primary text-primary-foreground py-2 ${className}`}>
      <div className={`whitespace-nowrap ${speedClass}`}>
        <span className="text-sm font-medium px-8">
          {text}
        </span>
      </div>
    </div>
  );
};