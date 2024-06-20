import { SimpleMdeReact } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./editor-style.css";
import { useMemo } from "react";

export default function Editor({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (_: string) => void;
  className?: string;
}) {
  const options = useMemo(
    () => ({ toolbar: false, status: false, spellChecker: false }),
    []
  );
  return (
    <div className={className}>
      <SimpleMdeReact value={value} onChange={onChange} options={options} />
    </div>
  );
}
