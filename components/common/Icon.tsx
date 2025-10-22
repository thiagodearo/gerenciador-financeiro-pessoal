import React from 'react';

type IconName = 'plus' | 'edit' | 'trash' | 'close' | 'credit-card' | 'dollar-sign' | 'trending-up' | 'trending-down' | 'upload' | 'download' | 'arrow-up-right' | 'arrow-down-right' | 'building-library' | 'wallet' | 'arrow-path' | 'cog-6-tooth' | 'google';

// FIX: Add the `title` property to allow passing it to the underlying SVG for accessibility.
interface IconProps {
  name: IconName;
  className?: string;
  title?: string;
}

// FIX: Replace `JSX.Element` with `React.ReactElement` to avoid referencing the `JSX` namespace which was not found.
// FIX: By specifying the props type for the ReactElement, we allow TypeScript to correctly infer types for React.cloneElement.
const ICONS: Record<IconName, React.ReactElement<React.SVGProps<SVGSVGElement>>> = {
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
  ),
  trash: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  'credit-card': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  'dollar-sign': (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m0-10a9 9 0 110 18 9 9 0 010-18z" />
    </svg>
  ),
  'trending-up': (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  'trending-down': (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  upload: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
    </svg>
  ),
  download: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  'arrow-up-right': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),
  'arrow-down-right': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
    </svg>
  ),
  'building-library': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
  ),
  'wallet': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0-2.25-2.25H5.25L3 12m18 0-2.25 2.25H5.25L3 12m9 6h.008v.008H12v-.008Z" />
    </svg>
  ),
  'arrow-path': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a7.5 7.5 0 01-1.066 2.593l-2.257 2.257a3.375 3.375 0 01-4.773 0l-2.257-2.257a3.375 3.375 0 010-4.773l2.257-2.257a7.5 7.5 0 012.593-1.066h.001v4.992a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75H9.348a.75.75 0 000 1.5h4.992l-1.171 1.171a5.25 5.25 0 00-7.424 7.424l-1.172 1.172a.75.75 0 001.061 1.06l1.171-1.172a5.25 5.25 0 007.424-7.424l1.172-1.171Z" />
    </svg>
  ),
  'cog-6-tooth': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226l.052-.022c.51-.223 1.073-.223 1.583 0l.052.022c.55.223 1.02.684 1.11 1.226l.065.401a1.65 1.65 0 001.32 1.32l.401.065c.542.09.997.557 1.222 1.103l.022.053c.224.51.224 1.073 0 1.583l-.022.052a1.653 1.653 0 01-1.222 1.11l-.401.065a1.65 1.65 0 00-1.32 1.32l-.065.401c-.09.542-.56.997-1.11 1.222l-.052.022c-.51.224-1.073.224-1.583 0l-.052-.022a1.653 1.653 0 01-1.11-1.222l-.065-.401a1.65 1.65 0 00-1.32-1.32l-.401-.065a1.653 1.653 0 01-1.222-1.11l-.022-.052c-.224-.51-.224-1.073 0-1.583l.022-.053c.225-.546.68-.997 1.222-1.103l.401-.065a1.65 1.65 0 001.32-1.32l.065-.401M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
  ),
  google: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  )
};

// FIX: The `title` attribute on SVG elements was causing a type error. A robust alternative for accessibility is to add a <title> element as a child.
export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6', title }) => {
  const icon = ICONS[name];
  // Using React.cloneElement is the idiomatic way to add/modify props of an element.
  // New children replace existing children, so we must also pass the original children.
  return React.cloneElement(
    icon,
    { className },
    ...React.Children.toArray(icon.props.children),
    title ? <title key="title">{title}</title> : null
  );
};
