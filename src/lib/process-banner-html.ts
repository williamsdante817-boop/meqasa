export function processBannerHtml(html: string): string {
  return html
    .replace(
      /href=(["'])([^"']*)\/follow-ad[^"']*\?u=([^"'&]*)([^"']*)\1/gi,
      (_, quote, prefix, redirectUrl) => {
        return `href=${quote}${decodeURIComponent(redirectUrl)}${quote} target="_blank" rel="noopener noreferrer"`;
      }
    )
    .replace(
      /<a(?![^>]*target=)/gi,
      '<a target="_blank" rel="noopener noreferrer"'
    );
}
