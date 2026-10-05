"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-md border bg-gray-50" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(nextValue) => onChange(nextValue || "")}
        preview="live"
        height={320}
        textareaProps={{ "aria-label": label, placeholder: "Escreva a descrição usando Markdown..." }}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Use a barra de ferramentas para formatar o texto. A prévia aparece ao lado do editor.
      </p>
    </div>
  );
}
