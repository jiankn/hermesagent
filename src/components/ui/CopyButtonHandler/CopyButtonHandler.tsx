'use client';

import { useEffect } from 'react';

export default function CopyButtonHandler() {
  useEffect(() => {
    const handleCopyClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('copy-button')) return;

      const wrapper = target.closest('.code-block-wrapper');
      if (!wrapper) return;

      const code = wrapper.querySelector('code');
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.textContent || '');
        const originalText = target.dataset.originalText || 'Copy';
        target.textContent = 'Copied!';
        target.classList.add('copied');
        
        setTimeout(() => {
          target.textContent = originalText;
          target.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };

    document.addEventListener('click', handleCopyClick);
    return () => {
      document.removeEventListener('click', handleCopyClick);
    };
  }, []);

  return null;
}
