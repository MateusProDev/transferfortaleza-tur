"use client";

import ImageUpload from "@/components/ui/ImageUpload";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { clearCachedSettings } from "@/lib/settings-cache";

type ContentValue = Record<string, unknown>;

interface ContentDocument {
  id: string;
  data: ContentValue;
}

interface ContentResponse {
  documents: ContentDocument[];
  totalDocuments: number;
  projectId: string | null;
}

const documentNames: Record<string, string> = {
  about: "Sobre",
  carousel: "Carrossel",
  categories: "Categorias",
  differentialsSection: "Diferenciais",
  footer: "Rodapé",
  googleReviews: "Avaliações do Google",
  header: "Cabeçalho",
  homeFAQ: "Perguntas frequentes da página inicial",
  homeSeo: "SEO da página inicial",
  imageCarouselSection: "Galeria de imagens",
  linkInBio: "Link na bio",
  pacotesPage: "Página de pacotes",
  servicesSection: "Serviços",
  transferBeberibe: "Transfer para Beberibe",
};

const hiddenFields = new Set(["id", "createdAt", "updatedAt"]);

function humanize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function updateAtPath(
  source: unknown,
  path: Array<string | number>,
  value: unknown,
): unknown {
  if (path.length === 0) return value;

  const [key, ...remaining] = path;
  if (Array.isArray(source)) {
    const result = [...source];
    const index = key as number;
    result[index] = updateAtPath(result[index], remaining, value);
    return result;
  }

  const record = source && typeof source === "object"
    ? source as ContentValue
    : {};
  return {
    ...record,
    [key]: updateAtPath(record[key as string], remaining, value),
  };
}

function blankLike(value: unknown): unknown {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, blankLike(item)]),
    );
  }
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  return "";
}

function isImageField(key: string, path: Array<string | number>): boolean {
  if (/alt|alternative/i.test(`${key}.${path.join(".")}`)) return false;
  if (/(image|photo|logo|ogimage|collage)/i.test(key)) return true;
  const parentPath = path.join(".");
  return /image|gallery|collage|banner/i.test(parentPath)
    || (/^(url|src)$/i.test(key) && /photo|picture/i.test(parentPath));
}

function isLongTextField(key: string): boolean {
  return /(description|descricao|summary|content|subtitle|subtitulo|answer|text|observ)/i.test(key);
}

export default function SiteContentAdminPage() {
  const [documents, setDocuments] = useState<ContentDocument[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<ContentValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const result = await response.json().catch(() => null) as
        | (Partial<ContentResponse> & { error?: string; code?: string })
        | null;
      if (!response.ok) {
        const message = result?.error || `A API respondeu com HTTP ${response.status}.`;
        const code = typeof result?.code === "string" ? ` Código Firebase: ${result.code}.` : "";
        const configurationHint = response.status === 503
          && /credenciais|configurad[oa]|autenticaç/i.test(message)
          ? " Confirme ADMIN_EMAILS e as credenciais Firebase Admin nas variáveis de ambiente do Vercel e verifique se apontam para o projeto Firebase do site."
          : "";
        const quotaHint = result?.code === "8" || result?.code === "resource-exhausted"
          ? " A quota não pode ser corrigida pelo painel: no Google Cloud Console, confira Firestore > Usage e IAM & Admin > Quotas e System Limits; verifique também se o faturamento do projeto Firebase está ativo. Se a quota diária foi consumida, aguarde a renovação ou solicite aumento de quota."
          : "";
        const authenticationHint = response.status === 401 || response.status === 403
          ? " Saia do painel e entre novamente com uma conta autorizada."
          : "";
        throw new Error(`${message}${code}${configurationHint}${quotaHint}${authenticationHint}`);
      }
      if (!Array.isArray(result?.documents)) {
        throw new Error("A resposta da API não contém a lista de documentos esperada.");
      }

      const records = result.documents;
      setDocuments(records);
      setProjectId(result.projectId || null);
      setSelectedId((currentId) =>
        records.some((record) => record.id === currentId)
          ? currentId
          : records[0]?.id || "",
      );
    } catch (error) {
      console.error("Error loading site content:", error);
      const message = error instanceof Error ? error.message : "Falha ao carregar conteúdo.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const selectedDocument = documents.find((document) => document.id === selectedId);

  useEffect(() => {
    setDraft(selectedDocument ? structuredClone(selectedDocument.data) : null);
  }, [selectedDocument]);

  function updateField(path: Array<string | number>, value: unknown) {
    setDraft((current) => current ? updateAtPath(current, path, value) as ContentValue : current);
  }

  async function saveContent() {
    if (!selectedId || !draft) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, data: draft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Falha ao salvar conteúdo.");

      setDocuments((current) => current.map((document) =>
        document.id === selectedId ? { ...document, data: structuredClone(draft) } : document,
      ));
      clearCachedSettings();
      toast.success("Conteúdo salvo.");
    } catch (error) {
      console.error("Error saving site content:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao salvar conteúdo.");
    } finally {
      setSaving(false);
    }
  }

  function renderField(
    label: string,
    value: unknown,
    path: Array<string | number>,
    key: string,
  ): React.ReactNode {
    if (hiddenFields.has(key)) return null;

    if (Array.isArray(value)) {
      return (
        <fieldset key={path.join(".")} className="space-y-3 rounded-lg border border-gray-200 p-4">
          <legend className="px-1 text-sm font-semibold text-gray-800">{label}</legend>
          {value.map((item, index) => (
            <div key={`${path.join(".")}-${index}`} className="rounded-md bg-gray-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
                <button
                  type="button"
                  onClick={() => updateField(path, value.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-xs font-medium text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
              {renderField(
                typeof item === "object" && item !== null ? "" : `Item ${index + 1}`,
                item,
                [...path, index],
                "",
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => updateField(path, [...value, value.length ? blankLike(value[0]) : ""])}
            className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            + Adicionar item
          </button>
        </fieldset>
      );
    }

    if (value && typeof value === "object") {
      return (
        <fieldset key={path.join(".")} className="space-y-4 rounded-lg border border-gray-200 p-4">
          {label && <legend className="px-1 text-sm font-semibold text-gray-800">{label}</legend>}
          {Object.entries(value as ContentValue).map(([childKey, childValue]) => {
            if (hiddenFields.has(childKey)) return null;
            return (
              <div key={[...path, childKey].join(".")} className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">{humanize(childKey)}</label>
                {renderField(humanize(childKey), childValue, [...path, childKey], childKey)}
              </div>
            );
          })}
        </fieldset>
      );
    }

    if (typeof value === "boolean") {
      return (
        <label key={path.join(".")} className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => updateField(path, event.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          {label}
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <input
          key={path.join(".")}
          type="number"
          value={value}
          onChange={(event) => updateField(path, Number(event.target.value))}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      );
    }

    const textValue = typeof value === "string" ? value : value == null ? "" : String(value);
    if (isImageField(key, path)) {
      return (
        <ImageUpload
          key={path.join(".")}
          currentImage={textValue}
          label=""
          onImageUpload={(url) => updateField(path, url)}
        />
      );
    }

    if (isLongTextField(key)) {
      return (
        <textarea
          key={path.join(".")}
          value={textValue}
          rows={4}
          onChange={(event) => updateField(path, event.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      );
    }

    return (
      <input
        key={path.join(".")}
        type="text"
        value={textValue}
        onChange={(event) => updateField(path, event.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Textos e seções</h1>
        <p className="mt-2 text-sm text-gray-600">
          Edite os textos, links, imagens e listas dos blocos de conteúdo do site.
          Para banners, passeios, transfers, artigos, depoimentos e perguntas frequentes, use as áreas próprias do menu.
          Informações de contato, navegação e identidade ficam em Configurações do site.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : loadError ? (
        <div role="alert" className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">Não foi possível carregar o conteúdo do Firebase.</p>
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => void loadDocuments()}
            className="rounded-md border border-red-300 bg-white px-3 py-2 font-medium hover:bg-red-100"
          >
            Tentar novamente
          </button>
        </div>
      ) : documents.length === 0 ? (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">A conexão com o Firebase funcionou, mas a coleção `content` retornou zero documentos.</p>
          <p>
            {projectId ? `Projeto conectado: ${projectId}. ` : ""}
            Se você esperava ver conteúdo existente, confirme se as credenciais Firebase do Vercel apontam
            para o mesmo projeto usado pelo site e se os documentos estão na coleção `content`.
          </p>
          <button
            type="button"
            onClick={() => void loadDocuments()}
            className="rounded-md border border-amber-300 bg-white px-3 py-2 font-medium hover:bg-amber-100"
          >
            Atualizar lista
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-gray-700">
              Seção para editar
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2"
              >
                {documents.map((document) => (
                  <option key={document.id} value={document.id}>
                    {documentNames[document.id] || humanize(document.id)}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-xs text-gray-500">
              {projectId ? `Projeto: ${projectId} · ` : ""}Documento: {selectedId}
            </span>
          </div>

          {draft && (
            <div className="space-y-5">
              {Object.entries(draft).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">{humanize(key)}</label>
                  {renderField(humanize(key), value, [key], key)}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={() => setDraft(selectedDocument ? structuredClone(selectedDocument.data) : null)}
              disabled={saving}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Descartar alterações
            </button>
            <button
              type="button"
              onClick={saveContent}
              disabled={saving || !draft}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-wait disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar seção"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
