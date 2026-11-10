// Shows text with **starred** words in the brand blue, e.g. "Why Choose **Zeemac**?"
export default function AccentText({ text, accentClassName = 'text-brand' }) {
  if (!text) return null;
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <span key={i} className={accentClassName}>
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
