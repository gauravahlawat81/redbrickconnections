export default function ControlButton({
  text,
  onClick,
  unclickable = false,
  type = "button", // Defaults to a normal button
}: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
  type?: "button" | "submit" | "reset"; // Add the type prop here
}) {
  const clickClass = unclickable ? "pointer-events-none" : "";
  const textColor = unclickable ? "border-stone-500" : "border-black";
  const borderColor = unclickable ? "text-stone-500" : "text-black";

  return (
    <button
      type={type}  // Important: pass the type to the <button>
      onClick={onClick}
      className={`${borderColor} border rounded-full ${textColor} font-medium py-3 px-4 text-l ${clickClass}`}
    >
      {text}
    </button>
  );
}

