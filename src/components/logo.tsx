interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'icon' | 'full';
  colorScheme?: 'auto' | 'light' | 'dark';
}

export function Logo({
  width = 40,
  height = 40,
  className = '',
  colorScheme = 'auto',
}: LogoProps) {
  const lightClassName =
    colorScheme === 'dark'
      ? 'hidden'
      : colorScheme === 'light'
        ? ''
        : 'dark:hidden';
  const darkClassName =
    colorScheme === 'dark'
      ? ''
      : colorScheme === 'light'
        ? 'hidden'
        : 'hidden dark:block';

  return (
    <>
      <img
        src="/images/signapse_logo_light.svg"
        alt="Signapse Logo"
        width={width}
        height={height}
        className={`object-contain ${lightClassName} ${className}`}
        decoding="async"
      />
      <img
        src="/images/signapse_logo_dark.svg"
        alt="Signapse Logo"
        width={width}
        height={height}
        className={`object-contain ${darkClassName} ${className}`}
        decoding="async"
      />
    </>
  );
}
