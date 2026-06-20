export const colors = {
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    danger: "#DC2626",
    dangerBorder: "#FECACA",
    dangerBg: "#FEF2F2",
    success: "#15803D",
    successBorder: "#BBF7D0",
    successBg: "#F0FDF4",
    warning: "#B45309",
    warningBorder: "#FDE68A",
    warningBg: "#FFFBEB",
    infoBg: "#EEF2FF",
    infoText: "#4338CA",
    infoBorder: "#C7D2FE",
    border: "#E5E7EB",
    text: "#111827",
    textMuted: "#6B7280",
    surface: "#FFFFFF",
    surfaceMuted: "#F9FAFB",
    bg: "#F3F4F6",
};
export const statusColor = {
    "To Do": {bg: colors.infoBg, color: colors.infoText, border: colors.infoBorder},
    "In Progress": {bg: colors.warningBg, color: colors.warning, border: colors.warningBorder},
    "Done": {bg: colors.successBg, color: colors.success, border: colors.successBorder},
};
export const radius = {
    sm: 6,
    md: 10,
    lg: 12,
    pill: 99,
};
export const font = {
    family: "Inter,system-ui, sans-serif",


};

//shared layered across platform on different pages
export const layout = {
    page: {minHeight: "100vh", background: colors.bg, fontFamily: font.family},
    nav: {
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    brand: {fontWeight: 600, fontSize: 15, color: colors.text},
    navRight: {display: "flex", alignItems: "center", gap: 12},
    navUser: {fontSize: 13, color: colors.textMuted},
};
export const alertStyle = (type) => ({
    fontSize: 13,
    color: type === "error" ? colors.danger : colors.success,
    background: type === "error" ? colors.dangerBg : colors.successBg,
    border: `1px solid ${type === "error" ? colors.dangerBorder : colors.successBorder}`,
    borderRadius: radius.sm,
    padding: "8px 12px",
    marginBottom: 16,
});