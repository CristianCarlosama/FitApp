import React from "react";

interface TextProps {
  children: React.ReactNode;
  // Cambiamos size por algo más semántico pero mantenemos compatibilidad
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "thin" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
  variant?: "default" | "muted" | "gradient" | "success" | "danger";
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "label"; // Para SEO y accesibilidad
  className?: string;
}

const Text: React.FC<TextProps> = ({
  children,
  size = "md",
  weight = "normal",
  variant = "default",
  as: Component = "p",
  className = "",
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl tracking-tight",
    "3xl": "text-3xl tracking-tight",
    "4xl": "text-4xl tracking-tighter leading-tight",
    "5xl": "text-5xl tracking-tighter leading-none",
    "6xl": "text-6xl tracking-tighter leading-none",
  };

  const weightClasses = {
    thin: "font-thin",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };

  const variants = {
    default: "text-white",
    muted: "text-gray-400",
    // El gradiente insignia de FitApp
    gradient: "bg-gradient-to-r from-purple-400 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent",
    success: "text-green-400",
    danger: "text-red-400",
  };

  return (
    <Component 
      className={`
        ${sizeClasses[size]} 
        ${weightClasses[weight]} 
        ${variants[variant]} 
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Text;