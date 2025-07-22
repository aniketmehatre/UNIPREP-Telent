export function removeExtraResponse(responseHtml: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = responseHtml;
    const container = tempDiv.querySelector('.container');
  
    if (container) {
      return container.outerHTML;
    } else {
      console.log('No container found in the response!');
      return '';
    }
}