import React from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';

/**
 * Button component that can be rendered as a button, anchor, or router link
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button style variant (primary, secondary, outline, text)
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {string} [props.type='button'] - Button type attribute (button, submit, reset)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {React.ReactNode} [props.icon] - Icon element to display
 * @param {string} [props.iconPosition='left'] - Position of the icon (left, right)
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.href] - URL for anchor tag
 * @param {string} [props.to] - Path for router Link
 * @param {string} [props.className] - Additional CSS classes
 */

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    disabled = false,
    fullWidth = false,
    icon = null,
    iconPosition = 'left',
    onClick,
    href,
    to,
    className = '',
    ...props
}) => {
    const buttonClasses = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${fullWidth ? 'btn-full-width' : ''} 
    ${icon ? 'btn-with-icon' : ''} 
    ${icon && !children ? 'btn-icon-only' : ''} 
    ${icon && children && iconPosition === 'right' ? 'btn-icon-right' : ''} 
    ${className}
  `.trim();

    // Render an anchor if href is provided
    if (href) {
        return (
            <a
                href={href}
                className={buttonClasses}
                onClick={onClick}
                disabled={disabled}
                {...props}
            >
                {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
                {children && <span className="btn-text">{children}</span>}
                {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
            </a>
        );
    }

    // Render a Link if to is provided
    if (to) {
        return (
            <Link
                to={to}
                className={buttonClasses}
                onClick={onClick}
                {...props}
            >
                {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
                {children && <span className="btn-text">{children}</span>}
                {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
            </Link>
        );
    }
}