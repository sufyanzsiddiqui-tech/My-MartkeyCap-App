export function StockLogo({
  symbol,
  bg,
  size = 36,
}: {
  symbol: string;
  bg: string;
  size?: number;
}) {
  const isLight = bg === "#fff" || bg === "#ffffff";
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: bg,
        color: isLight ? "#1b1f2a" : "#fff",
        border: isLight ? "1px solid #e5e7eb" : "none",
        fontSize: size * 0.4,
      }}
    >
      {symbol.slice(0, 1)}
    </div>
  );
}
