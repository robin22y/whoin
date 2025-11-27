interface BrandLogoProps {
  className?: string
  color?: string
}

export function BrandLogo({ className = "w-6 h-6", color = "text-white" }: BrandLogoProps) {
  return (
    <div className={`${className} bg-white rounded-md flex items-center justify-center ${color} font-bold text-xs shadow-sm`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      </svg>
    </div>
  )
}

