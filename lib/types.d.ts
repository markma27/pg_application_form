declare module 'tailwind-merge' {
  export function twMerge(...inputs: (string | undefined | null | false)[]): string;
}

declare module 'class-variance-authority' {
  export interface VariantProps<T extends (...args: any) => any> {
    [key: string]: any;
  }
  
  export function cva(
    base?: string,
    config?: {
      variants?: Record<string, Record<string, string>>;
      defaultVariants?: Record<string, string>;
    }
  ): (...args: any) => string;
} 