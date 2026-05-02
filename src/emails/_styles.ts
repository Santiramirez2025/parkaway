// Estilos compartidos para todos los emails de ParkAway.
// Los clientes de email no soportan Tailwind ni CSS vars, asi que mapeamos
// los tokens del proyecto (Warm Trust) a hex literales.
//
// Tokens:
//   bg principal     #FAF7F2  (marfil)
//   surface          #FFFFFF
//   border           #E8E1D5
//   foreground       #1A1F2E
//   muted-foreground #5C6373
//   primary (lime)   #1E3A5F  (navy)
//   accent           #C2724A  (terracota)

export const palette = {
  bg: "#FAF7F2",
  surface: "#FFFFFF",
  surfaceMuted: "#F2EDE5",
  border: "#E8E1D5",
  fg: "#1A1F2E",
  fgMuted: "#5C6373",
  fgSubtle: "#9AA0AC",
  primary: "#1E3A5F",
  accent: "#C2724A",
  accentSoft: "#F5E6DC",
} as const;

export const main = {
  backgroundColor: palette.bg,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  color: palette.fg,
  margin: 0,
  padding: 0,
};

export const container = {
  margin: "0 auto",
  padding: "0",
  maxWidth: "560px",
  backgroundColor: palette.bg,
};

export const card = {
  backgroundColor: palette.surface,
  border: `1px solid ${palette.border}`,
  borderRadius: "20px",
  padding: "24px",
  margin: "16px 0",
};

export const header = { padding: "32px 32px 8px" };
export const content = { padding: "8px 32px 32px" };
export const footer = { padding: "0 32px 32px" };

export const logo = {
  fontSize: "20px",
  fontWeight: 600,
  color: palette.fg,
  margin: 0,
  letterSpacing: "-0.01em",
};

export const logoAccent = { color: palette.accent };

export const h1 = {
  fontSize: "28px",
  fontWeight: 600,
  color: palette.fg,
  margin: "8px 0 16px",
  lineHeight: "1.15",
  letterSpacing: "-0.01em",
};

export const h2 = {
  fontSize: "16px",
  fontWeight: 600,
  color: palette.fg,
  margin: "24px 0 12px",
};

export const paragraph = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: palette.fgMuted,
  margin: "0 0 14px",
};

export const codeBox = {
  ...card,
  textAlign: "center" as const,
  padding: "20px 24px",
};

export const codeLabel = {
  fontSize: "11px",
  color: palette.fgMuted,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 6px",
};

export const codeValue = {
  fontSize: "26px",
  fontWeight: 600,
  color: palette.primary,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  margin: 0,
  letterSpacing: "2px",
};

export const rowLabel = {
  fontSize: "11px",
  color: palette.fgMuted,
  textTransform: "uppercase" as const,
  letterSpacing: "0.6px",
  margin: "0 0 4px",
};

export const rowValue = {
  fontSize: "15px",
  color: palette.fg,
  margin: 0,
  lineHeight: "1.4",
};

export const rowValueHighlight = {
  fontSize: "20px",
  fontWeight: 600,
  color: palette.primary,
  margin: 0,
};

export const button = {
  backgroundColor: palette.accent,
  color: palette.surface,
  borderRadius: "999px",
  padding: "14px 28px",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

export const buttonSecondary = {
  backgroundColor: palette.surface,
  color: palette.primary,
  border: `1px solid ${palette.border}`,
  borderRadius: "999px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

export const hr = {
  borderColor: palette.border,
  borderWidth: "1px 0 0 0",
  margin: "24px 0",
};

export const link = {
  color: palette.accent,
  textDecoration: "underline",
};

export const smallText = {
  fontSize: "13px",
  color: palette.fgMuted,
  lineHeight: "1.6",
  margin: "12px 0 0",
};

export const footerText = {
  fontSize: "12px",
  color: palette.fgSubtle,
  lineHeight: "1.6",
  margin: 0,
};

export const list = {
  paddingLeft: "20px",
  margin: "8px 0 18px",
  color: palette.fgMuted,
};

export const listItem = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: palette.fgMuted,
};
