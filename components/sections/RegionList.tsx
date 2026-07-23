interface RegionListProps {
  items: string[];
  heading?: string;
  columns?: 2 | 3;
}

/**
 * An editorial index rather than a bulleted checklist: serif labels,
 * generous line height, and a hairline rule beneath each entry — the same
 * device a report or annual review uses to list holdings or markets.
 * Deliberately no dot markers, icons, or map pins — per Design Direction,
 * no office markers or confirmed-route implications, and per this sprint's
 * direction, no decorative graphics standing in for editorial composition.
 */
export function RegionList({ items, heading, columns = 2 }: RegionListProps) {
  return (
    <div>
      {heading && (
        <h3 className="mb-8 font-serif text-[length:var(--text-h3)] font-medium leading-[1.2]">{heading}</h3>
      )}
      <ul
        className={`grid grid-cols-1 gap-x-10 sm:grid-cols-2 ${
          columns === 3 ? "lg:grid-cols-3" : ""
        }`}
      >
        {items.map((item) => (
          <li key={item} className="border-b border-line py-4">
            <span className="font-serif text-[1.15rem] leading-[1.3]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
