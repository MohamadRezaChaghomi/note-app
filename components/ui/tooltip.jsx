// components/ui/Tooltip.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Info, HelpCircle, AlertCircle, 
  CheckCircle, XCircle, Star,
  ExternalLink, Copy, Link as LinkIcon
} from "lucide-react";

const iconMap = {
  info: Info,
  help: HelpCircle,
  warning: AlertCircle,
  success: CheckCircle,
  error: XCircle,
  star: Star,
  external: ExternalLink,
  copy: Copy,
  link: LinkIcon
};
export { TooltipProvider, useTooltip } from "./tooltip-provider";
export default function Tooltip({ 
  children,
  content,
  position = "top",
  delay = 200,
  icon = null,
  type = "default",
  maxWidth = "200px",
  interactive = false,
  className = "",
  onShow = null,
  onHide = null
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  let showTimeout, hideTimeout;

  const Icon = icon ? iconMap[icon] : null;

  const typeStyles = {
    default: {
      bg: "bg-gray-900",
      text: "text-white",
      border: "border-gray-800",
      icon: "text-gray-400"
    },
    info: {
      bg: "bg-blue-500",
      text: "text-white",
      border: "border-blue-600",
      icon: "text-blue-100"
    },
    warning: {
      bg: "bg-yellow-500",
      text: "text-white",
      border: "border-yellow-600",
      icon: "text-yellow-100"
    },
    success: {
      bg: "bg-green-500",
      text: "text-white",
      border: "border-green-600",
      icon: "text-green-100"
    },
    error: {
      bg: "bg-red-500",
      text: "text-white",
      border: "border-red-600",
      icon: "text-red-100"
    },
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      border: "border-gray-200",
      icon: "text-gray-500"
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-gray-100",
      border: "border-gray-700",
      icon: "text-gray-400"
    }
  };

  const positionStyles = {
    top: {
      main: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      arrow: "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
      arrowDirection: "border-t-gray-900"
    },
    bottom: {
      main: "top-full left-1/2 -translate-x-1/2 mt-2",
      arrow: "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
      arrowDirection: "border-b-gray-900"
    },
    left: {
      main: "right-full top-1/2 -translate-y-1/2 mr-2",
      arrow: "left-full top-1/2 -translate-y-1/2 -translate-x-1/2",
      arrowDirection: "border-l-gray-900"
    },
    right: {
      main: "left-full top-1/2 -translate-y-1/2 ml-2",
      arrow: "right-full top-1/2 -translate-y-1/2 translate-x-1/2",
      arrowDirection: "border-r-gray-900"
    },
    "top-left": {
      main: "bottom-full right-0 mb-2",
      arrow: "top-full right-2 -translate-y-1/2",
      arrowDirection: "border-t-gray-900"
    },
    "top-right": {
      main: "bottom-full left-0 mb-2",
      arrow: "top-full left-2 -translate-y-1/2",
      arrowDirection: "border-t-gray-900"
    },
    "bottom-left": {
      main: "top-full right-0 mt-2",
      arrow: "bottom-full right-2 translate-y-1/2",
      arrowDirection: "border-b-gray-900"
    },
    "bottom-right": {
      main: "top-full left-0 mt-2",
      arrow: "bottom-full left-2 translate-y-1/2",
      arrowDirection: "border-b-gray-900"
    }
  };

  const styles = typeStyles[type] || typeStyles.default;
  const posStyle = positionStyles[position] || positionStyles.top;

  const showTooltip = () => {
    clearTimeout(hideTimeout);
    
    showTimeout = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
      
      setIsVisible(true);
      setIsHovered(true);
      if (onShow) onShow();
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(showTimeout);
    
    hideTimeout = setTimeout(() => {
      if (!interactive || !isHovered) {
        setIsVisible(false);
        setIsFocused(false);
        if (onHide) onHide();
      }
    }, 100);
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    hideTooltip();
  };

  const handleFocus = () => {
    setIsFocused(true);
    showTooltip();
  };

  const handleBlur = () => {
    setIsFocused(false);
    hideTooltip();
  };

  const handleTooltipMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
      clearTimeout(hideTimeout);
    }
  };

  const handleTooltipMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
      hideTooltip();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  const isActive = isVisible || isHovered || isFocused;

  return (
    <div className={`tooltip-container ${className}`}>
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        
        .trigger-content {
          display: inline-block;
          cursor: ${interactive ? 'pointer' : 'help'};
        }
        
        .tooltip {
          position: fixed;
          z-index: 9999;
          max-width: ${maxWidth};
          pointer-events: ${interactive && isActive ? 'auto' : 'none'};
          opacity: 0;
          transform: scale(0.95) translateY(-5px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .tooltip.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }
        
        .tooltip-content {
          position: relative;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                      0 8px 10px -6px rgba(0, 0, 0, 0.1);
          font-size: 0.75rem;
          line-height: 1.4;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        
        .tooltip-arrow {
          position: absolute;
          width: 0.5rem;
          height: 0.5rem;
          border: 0.25rem solid transparent;
        }
        
        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.25rem;
        }
        
        .tooltip-title {
          font-weight: 600;
          font-size: 0.75rem;
        }
        
        .tooltip-body {
          font-size: 0.75rem;
        }
        
        .tooltip-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tooltip-btn {
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.625rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tooltip-btn.primary {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .tooltip-btn.primary:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .tooltip-btn.secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .tooltip-btn.secondary:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        /* Animation variations */
        .tooltip.fade {
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .tooltip.fade.visible {
          opacity: 1;
        }
        
        .tooltip.slide-up {
          transform: translateY(10px);
          opacity: 0;
        }
        
        .tooltip.slide-up.visible {
          transform: translateY(0);
          opacity: 1;
        }
        
        .tooltip.scale {
          transform: scale(0.9);
          opacity: 0;
        }
        
        .tooltip.scale.visible {
          transform: scale(1);
          opacity: 1;
        }
        
        /* Type-specific animations */
        .tooltip[data-type="success"] {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .tooltip[data-type="warning"] {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .tooltip-content.light {
            background: #374151;
            color: #f3f4f6;
            border-color: #4b5563;
          }
        }
      `}</style>

      <div 
        ref={triggerRef}
        className="trigger-content"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="tooltip"
        aria-describedby={`tooltip-${Date.now()}`}
      >
        {children}
      </div>

      {isActive && (
        <div 
          ref={tooltipRef}
          className={`tooltip ${isActive ? 'visible' : ''}`}
          style={{
            left: coords.x,
            top: coords.y
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          data-type={type}
          id={`tooltip-${Date.now()}`}
          role="tooltip"
        >
          <div className={`tooltip-content ${styles.bg} ${styles.text} ${styles.border}`}>
            <div className="tooltip-arrow" style={{
              [position.includes('top') ? 'bottom' : 
               position.includes('bottom') ? 'top' :
               position.includes('left') ? 'right' : 'left']: '100%',
              [position.includes('left') ? 'top' : 
               position.includes('right') ? 'top' : 'left']: '50%'
            }} />
            
            {(Icon || typeof content === 'object') && (
              <div className="tooltip-header">
                {Icon && (
                  <div className={styles.icon}>
                    <Icon className="w-3 h-3" />
                  </div>
                )}
                {typeof content === 'object' && content.title && (
                  <div className="tooltip-title">{content.title}</div>
                )}
              </div>
            )}
            
            <div className="tooltip-body">
              {typeof content === 'string' ? content : content?.content}
            </div>
            
            {typeof content === 'object' && content.actions && (
              <div className="tooltip-footer">
                {content.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`tooltip-btn ${action.primary ? 'primary' : 'secondary'} ${styles.text}`}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Tooltip shortcut components
export function InfoTooltip({ children, ...props }) {
  return (
    <Tooltip icon="info" type="info" {...props}>
      {children}
    </Tooltip>
  );
}

export function WarningTooltip({ children, ...props }) {
  return (
    <Tooltip icon="warning" type="warning" {...props}>
      {children}
    </Tooltip>
  );
}

export function SuccessTooltip({ children, ...props }) {
  return (
    <Tooltip icon="success" type="success" {...props}>
      {children}
    </Tooltip>
  );
}

export function ErrorTooltip({ children, ...props }) {
  return (
    <Tooltip icon="error" type="error" {...props}>
      {children}
    </Tooltip>
  );
}

export function HelpTooltip({ children, ...props }) {
  return (
    <Tooltip icon="help" type="info" {...props}>
      {children}
    </Tooltip>
  );
}

// Tooltip with copy functionality
export function CopyTooltip({ children, textToCopy, ...props }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Tooltip 
      icon="copy" 
      type={copied ? "success" : "default"}
      content={copied ? "Copied!" : "Click to copy"}
      interactive={true}
      onShow={handleCopy}
      {...props}
    >
      {children}
    </Tooltip>
  );
}