import {colors, radius} from "../../core/theme.js";
// variant :"primary" | "danger" |"ghost"
//size "sm" |"md"

export default function Button({
    children,
    onClick,
    variant="primary",
    size="md",
    disabled=false,
    type="button",
    style={},
                               }){
    const base={
fontWeight:500,
        border:"1px solid transparent",
        borderRadius:radius.sm,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity:disabled ? 0.6:1,
        transition:"opacity 0.15s ease",
    };
const sizes ={
    sm:{padding:"5px 12px",fontSize:12},
    md:{padding:"8px 18px",fontSize:13},
};
const variants={
    primary:{
        background:colors.primary,
        color:"#fff",
        border:"1px solid transparent",
    },
    danger:{
        background:"transparent",
        color:colors.danger,
        border:`1px solid ${colors.dangerBorder}`,
    },
    ghost:{
        background:"transparent",
        color:colors.textMuted,
        border:`1px solid ${colors.border}`,
    },
};
return (
    <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={{...base,...sizes[size],...variants[variant],...style
    }}
    >
        {children}
    </button>
);
}