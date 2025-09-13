import { media as wixMedia } from '@wix/sdk';

type AnyRecord = Record<string, any>;

function escapeHtml(input: string): string {
  return (input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveImageUrl(imageLike: any): string | undefined {
  if (!imageLike) return undefined;
  if (typeof imageLike === 'string') {
    if (imageLike.startsWith('http')) return imageLike;
    const wixId = imageLike.startsWith('wix:image://')
      ? imageLike
      : `wix:image://v1/${imageLike}`;
    try {
      return wixMedia.getScaledToFillImageUrl(wixId, 1024, 576, {});
    } catch (e) {
      return undefined;
    }
  }
  if (typeof imageLike?.url === 'string') return imageLike.url;
  if (typeof imageLike?.src?.id === 'string') {
    const wixId = imageLike.src.id.startsWith('wix:image://')
      ? imageLike.src.id
      : `wix:image://v1/${imageLike.src.id}`;
    try {
      return wixMedia.getScaledToFillImageUrl(wixId, 1024, 576, {});
    } catch (e) {}
  }
  if (typeof imageLike?.id === 'string') {
    const wixId = imageLike.id.startsWith('wix:image://')
      ? imageLike.id
      : `wix:image://v1/${imageLike.id}`;
    try {
      return wixMedia.getScaledToFillImageUrl(wixId, 1024, 576, {});
    } catch (e) {}
  }
  if (typeof imageLike?.media?.url === 'string') return imageLike.media.url;
  return undefined;
}

function renderTextNodes(nodes: AnyRecord[] = []): string {
  return nodes
    .map((child: AnyRecord) => {
      if (child?.type === 'TEXT') {
        let text = escapeHtml(child?.textData?.text || '');
        const decorations = child?.textData?.decorations || [];
        const linkDeco = decorations.find((d: AnyRecord) => d?.type === 'LINK');
        const isBold = decorations.some((d: AnyRecord) => d?.type === 'BOLD');
        const isItalic = decorations.some(
          (d: AnyRecord) => d?.type === 'ITALIC'
        );
        const isUnderline = decorations.some(
          (d: AnyRecord) => d?.type === 'UNDERLINE'
        );
        if (linkDeco?.linkData?.link?.url) {
          const href = escapeHtml(linkDeco.linkData.link.url);
          const target = linkDeco.linkData.link.target;
          const mappedTarget = target === 'BLANK' ? '_blank' : '_self';
          text = `<a href="${href}" target="${mappedTarget}" rel="noopener noreferrer">${text}</a>`;
        }
        if (isBold) text = `<strong>${text}</strong>`;
        if (isItalic) text = `<em>${text}</em>`;
        if (isUnderline) text = `<u>${text}</u>`;
        return text;
      }
      if (Array.isArray(child?.nodes) && child.nodes.length > 0) {
        return renderTextNodes(child.nodes);
      }
      return '';
    })
    .join('');
}

function renderNode(node: AnyRecord): string {
  switch (node?.type) {
    case 'PARAGRAPH': {
      const content = renderTextNodes(node?.nodes || []);
      return content ? `<p class="mb-4 leading-relaxed">${content}</p>` : '';
    }
    case 'HEADING': {
      const level = node?.headingData?.level || 2;
      const content = renderTextNodes(node?.nodes || []);
      return `<h${level} class="font-outfit font-bold text-2xl mt-4">${content}</h${level}>`;
    }
    case 'BULLETED_LIST': {
      const items = (node?.nodes || [])
        .map((li: AnyRecord) => renderNode(li))
        .join('');
      return `<ul class="my-4 list-disc pl-4 space-y-1">${items}</ul>`;
    }
    case 'ORDERED_LIST': {
      const items = (node?.nodes || [])
        .map((li: AnyRecord) => renderNode(li))
        .join('');
      return `<ol class="my-4 list-decimal pl-4 space-y-1">${items}</ol>`;
    }
    case 'LIST_ITEM': {
      const content = (node?.nodes || [])
        .map((n: AnyRecord) => renderNode(n))
        .join('');
      return `<li class="leading-relaxed">${content}</li>`;
    }
    case 'IMAGE': {
      const url = resolveImageUrl(node?.imageData?.image);
      const alt = escapeHtml(node?.imageData?.altText || '');
      const caption = escapeHtml(node?.imageData?.caption || '');
      return url
        ? caption
          ? `<figure class="mb-4 p-4 text-center"><img class="my-4 rounded-md" src="${url}" alt="${alt}" /><figcaption class="text-sm text-gray-500">${caption}</figcaption></figure>`
          : `<img class="my-4 rounded-md" src="${url}" alt="${alt}" />`
        : '';
    }
    case 'GALLERY': {
      const items = Array.isArray(node?.galleryData?.items)
        ? node.galleryData.items
        : [];
      const imgs = items
        .map((it: AnyRecord) => {
          const url = resolveImageUrl(it?.image || it?.imageData?.image);
          const alt = escapeHtml(it?.image?.altText || it?.altText || '');
          return url ? `<img src="${url}" alt="${alt}" />` : '';
        })
        .filter(Boolean)
        .join('');
      return imgs ? `<div class="gallery my-4 grid gap-4">${imgs}</div>` : '';
    }
    default:
      return '';
  }
}

function renderRichContentToHtml(richContent: AnyRecord): string {
  const nodes = Array.isArray(richContent?.nodes) ? richContent.nodes : [];
  return nodes.map((n: AnyRecord) => renderNode(n)).join('\n');
}

export default function RichContent({
  richContent,
  contentText,
}: {
  richContent?: AnyRecord;
  contentText?: string;
}) {
  if (richContent?.nodes?.length) {
    return (
      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{
          __html: renderRichContentToHtml(richContent),
        }}
      />
    );
  }
  if (contentText) {
    return (
      <div className="prose prose-neutral max-w-none whitespace-pre-wrap">
        {contentText}
      </div>
    );
  }
  return null;
}
